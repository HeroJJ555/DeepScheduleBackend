import fs from 'fs/promises';
import path from 'path';
import { generateTimetable } from './solver.js';
import { validateInputSchema, formatCSV, formatJSON } from './utils.js';

function parseArgs() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error('Usage: cli.js <input.json> <output.{json|csv}>');
    process.exit(1);
  }
  return { inputPath, outputPath };
}

export async function runCli() {
  try {
    const { inputPath, outputPath } = parseArgs();
    const raw = await fs.readFile(inputPath, 'utf-8');
    const payload = JSON.parse(raw);
    validateInputSchema(payload);

    const timetable = await generateTimetable(payload);

    const ext = path.extname(outputPath).toLowerCase();
    const output = ext === '.csv'
      ? formatCSV(timetable)
      : formatJSON(timetable);

    await fs.writeFile(outputPath, output, 'utf-8');
    console.log(`Timetable written to ${outputPath}`);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(2);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli();
}
