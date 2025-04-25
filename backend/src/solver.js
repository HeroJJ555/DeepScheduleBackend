import GLPK from 'glpk.js';

/**
 * @returns {Promise<any>}
 */
export async function loadGLPK() {
  return await GLPK();
}

/**
 * @param {Object<number, number[]>} teachersMap
 * @param {number[]} classIds
 * @param {Object<number, Object<number, number>>} subjectsMap  classId → { subjectId: hours }
 * @param {{ id: number, day: number, hour: number }[]} timeslots
 * @param {any} glpk 
 * @returns {Object}
 */
export function buildModel(teachersMap, classIds, subjectsMap, timeslots, glpk) {
  const binaries = [];
  const bounds = [];
  const subjectTo = [];
  const varName = (cls, subj, tsIdx) => `x_${cls}_${subj}_${tsIdx}`;

  classIds.forEach(cls => {
    const need = subjectsMap[cls] || {};
    Object.keys(need).forEach(subjKey => {
      const subj = Number(subjKey);
      timeslots.forEach((_, tsIdx) => {
        const name = varName(cls, subj, tsIdx);
        binaries.push(name);
        bounds.push({ name, type: glpk.GLP_DB, lb: 0, ub: 1 });
      });
    });
  });

  classIds.forEach(cls => {
    const need = subjectsMap[cls] || {};
    Object.entries(need).forEach(([subjKey, hrs]) => {
      const subj = Number(subjKey);
      const coefs = timeslots.map((_, tsIdx) => ({
        name: varName(cls, subj, tsIdx),
        coef: 1
      }));
      subjectTo.push({
        name: `class_${cls}_subj_${subj}`,
        vars: coefs,
        bnds: { type: glpk.GLP_FX, lb: hrs, ub: hrs }
      });
    });
  });

  Object.entries(teachersMap).forEach(([tKey, canTeach]) => {
    const teacherId = Number(tKey);
    timeslots.forEach((_, tsIdx) => {
      const coefs = [];
      classIds.forEach(cls => {
        canTeach.forEach(subj => {
          coefs.push({ name: varName(cls, subj, tsIdx), coef: 1 });
        });
      });
      subjectTo.push({
        name: `teacher_${teacherId}_ts_${tsIdx}`,
        vars: coefs,
        bnds: { type: glpk.GLP_UP, ub: 1 }
      });
    });
  });

  return {
    name: 'timetable',
    objective: { direction: glpk.GLP_MIN, name: 'obj', vars: [] },
    subjectTo,
    binaries,
    bounds
  };
}

/**
 * @param {Object} model
 * @param {any}     glpk
 * @param {Object} [options]
 */
export function solveModel(model, glpk, options = {}) {
  return glpk.solve(model, options);
}

/**
 *
 * @param {Object<string, number>} vars
 * @param {{ id: number }[]}       timeslots
 * @returns {{ classId: number, subjectId: number, timeslotId: number }[]}
 */
export function parseSolution(vars, timeslots) {
  const entries = [];
  for (const [name, val] of Object.entries(vars)) {
    if (val === 1) {
      const [, cls, subj, idx] = name.split('_');
      entries.push({
        classId:   Number(cls),
        subjectId: Number(subj),
        timeslotId: timeslots[Number(idx)].id
      });
    }
  }
  return entries;
}

/**
 *
 * @param {Object} input
 *   - teachersMap: { [teacherId]: [subjectId,…] }
 *   - classIds:    number[]
 *   - subjectsMap: { [classId]: { [subjectId]: hours } }
 *   - timeslots:   Array<{ id, day, hour }>
 */
export async function generateTimetable(input) {
  const { teachersMap, classIds, subjectsMap, timeslots } = input;
  const glpk = await loadGLPK();
  const model = buildModel(teachersMap, classIds, subjectsMap, timeslots, glpk);
  const result = solveModel(model, glpk, { msglev: glpk.GLP_MSG_OFF });
  if (![glpk.GLP_OPT, glpk.GLP_FEASIBLE].includes(result.result.status)) {
    throw new Error('Nie znaleziono pasującego planu lekcji');
  }
  return parseSolution(result.result.vars, timeslots);
}
