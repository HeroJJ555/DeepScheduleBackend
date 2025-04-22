import GLPK from 'glpk.js';

/**
 * 
 * @returns {Promise<GLPK>} glpk 
 */
export async function loadGLPK() {
  return await GLPK();
}

/**
 * @param {Object} teachers 
 * @param {string[]} classes
 * @param {Object} subjects 
 * @param {Object[]} timeslots  
 * @param {Object} glpk 
 * @returns {Object} 
 */
export function buildModel(teachers, classes, subjects, timeslots, glpk) {
  const binaries = [];
  const bounds = [];
  const varName = (c, s, idx) => `x_${c}_${s}_${idx}`;

  classes.forEach(c => {
    Object.keys(subjects[c]).forEach(s => {
      timeslots.forEach((_, idx) => {
        binaries.push(varName(c, s, idx));
        bounds.push({
          name: varName(c, s, idx),
          type: glpk.GLP_DB,
          lb: 0,
          ub: 1
        });
      });
    });
  });

  const subjectTo = [];

  classes.forEach(c => {
    Object.entries(subjects[c]).forEach(([s, hours]) => {
      const coefs = {};
      timeslots.forEach((_, idx) => {
        coefs[varName(c, s, idx)] = 1;
      });
      subjectTo.push({
        name: `class_${c}_${s}`,
        vars: Object.entries(coefs).map(([name, coef]) => ({ name, coef })),
        bnds: { type: glpk.GLP_FX, lb: hours, ub: hours }
      });
    });
  });

  Object.entries(teachers).forEach(([t, teaches]) => {
    timeslots.forEach((_, idx) => {
      const coefs = {};
      classes.forEach(c => {
        teaches.forEach(s => {
          const name = varName(c, s, idx);
          coefs[name] = (coefs[name] || 0) + 1;
        });
      });
      subjectTo.push({
        name: `teacher_${t}_${idx}`,
        vars: Object.entries(coefs).map(([name, coef]) => ({ name, coef })),
        bnds: { type: glpk.GLP_UP, ub: 1 }
      });
    });
  });

  return {
    name: 'timetable',
    objective: {
      direction: glpk.GLP_MIN,
      name: 'obj',
      vars: [] 
    },
    subjectTo,
    binaries,
    bounds
  };
}

/**
 * @param {Object} model 
 * @param {Object} glpk 
 * @param {Object} [options] 
 * @returns {Object} 
 */
export function solveModel(model, glpk, options = {}) {
  return glpk.solve(model, options);
}

/**
 * @param {Object} vars 
 * @param {Object[]} timeslots 
 * @returns {Object}
 */
export function parseSolution(vars, timeslots) {
  const timetable = {};
  for (const [name, val] of Object.entries(vars)) {
    if (val === 1) {
      const [, cls, subj, idxStr] = name.split('_');
      const slot = timeslots[+idxStr];
      timetable[cls] = timetable[cls] || [];
      timetable[cls].push({
        day: slot.day,
        hour: slot.hour,
        subject: subj
      });
    }
  }
  return timetable;
}

/**
 * @param {Object} input
 * @returns {Promise<Object>}
 */
export async function generateTimetable(input) {
  const { teachers, classes, subjects, timeslots } = input;
  const glpk = await loadGLPK();
  const model = buildModel(teachers, classes, subjects, timeslots, glpk);
  const result = solveModel(model, glpk, { msglev: glpk.GLP_MSG_OFF });
  if (result.result.status !== glpk.GLP_OPT) {
    throw new Error('Nie znaleziono pasującego planu lekcji');
  }
  return parseSolution(result.result.vars, timeslots);
}
