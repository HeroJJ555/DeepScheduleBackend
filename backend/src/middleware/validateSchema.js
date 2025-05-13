// backend/src/middleware/validateSchema.js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);  // rejestruje m.in. "email", "uri", "date", etc.

/**
 * @param {object|boolean} schema – obiekt JSON-Schema lub true/false.
 * Jeśli schema jest false/undefined, zwraca pusty middleware.
 */
export default function validateSchema(schema) {
  if (!schema) {
    return (req, res, next) => next();
  }

  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid) {
      const message = ajv.errorsText(validate.errors, { separator: '; ' });
      return res.status(400).json({ error: message });
    }
    next();
  };
}
