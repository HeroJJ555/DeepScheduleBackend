import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export default function validateSchema(schema) {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
      const valid = validate(req.body);
      if (!valid) {
        const errors = validate.errors
          .map(e => `${e.instancePath} ${e.message}`)
          .join(', ');
        return res.status(400).json({ error: `Nieprawidłowy JSON: ${errors}` });
      }
      next();
    };
  }