import Ajv from 'ajv';
const ajv = new Ajv();

/** JSON‐schema dla wejścia */
const schema = {
  type: 'object',
  required: ['teachers','classes','subjects','timeslots'],
  properties: {
    teachers: {
      type: 'object',
      patternProperties: { '^.+$': { type: 'array', items: { type: 'string' } } }
    },
    classes: { type: 'array', items: { type: 'string' } },
    subjects: {
      type: 'object',
      patternProperties: {
        '^.+$': {
          type: 'object',
          patternProperties: { '^.+$': { type: 'number', minimum: 0 } }
        }
      }
    },
    timeslots: {
      type: 'array',
      items: {
        type: 'object',
        required: ['day','hour'],
        properties: { day: { type: 'number' }, hour: { type: 'number' } }
      }
    }
  }
};

const validate = ajv.compile(schema);

/**
 * Waliduje payload
 * @param {Object} payload
 */
export function validateInputSchema(payload) {
  if (!validate(payload)) {
    const msg = validate.errors.map(e => `${e.instancePath} ${e.message}`).join(', ');
    throw new Error(`Invalid input schema: ${msg}`);
  }
}

/**
 * timetable do CSV.
 * @param {Object} timetable – mapa → [ { day, hour, subject } ]
 * @returns {string} CSV string
 */
export function formatCSV(timetable) {
  const lines = ['class,day,hour,subject'];
  Object.entries(timetable).forEach(([cls, sessions]) => {
    sessions.forEach(({ day, hour, subject }) => {
      lines.push(`${cls},${day},${hour},${subject}`);
    });
  });
  return lines.join('\n');
}

/**
 * @param {Object} timetable
 * @returns {string}
 */
export function formatJSON(timetable) {
  return JSON.stringify(timetable, null, 2);
}
