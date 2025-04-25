import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/index.js';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Do testowania lokalnie 
//app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(config.port, () => {
  console.log(`Serwer działa na http://localhost:${config.port}`);
});
