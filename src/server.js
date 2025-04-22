
import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateTimetable } from './solver.js';
import { validateInputSchema } from './utils.js';

const app = express();
app.use(bodyParser.json());
//TEST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));
app.use('/data', express.static(path.join(__dirname, '../src/data')));
app.post('/generate', async (req, res) => {
  try {
    validateInputSchema(req.body);
    const timetable = await generateTimetable(req.body);
    res.json({ timetable });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend + frontend serving on http://localhost:${PORT}`);
});