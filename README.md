<p align="center">
  <pre>
______                _____      _              _       _      
|  _  \              /  ___|    | |            | |     | |     
| | | |___  ___ _ __ \ `--.  ___| |__   ___  __| |_   _| | ___ 
| | | / _ \/ _ \ '_ \ `--. \/ __| '_ \ / _ \/ _` | | | | |/ _ \
| |/ /  __/  __/ |_) /\__/ / (__| | | |  __/ (_| | |_| | |  __/
|___/ \___|\___| .__/\____/ \___|_| |_|\___|\__,_|\__,_|_|\___|
               | |                                             
               |_|                                             
  </pre>
  <h3 align="center">DeepSchedule Monorepo</h3>
  <p align="center">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Node-%3E%3D18-brightgreen" alt="Node.js version" />
    <img src="https://img.shields.io/badge/TypeScript-%3E%3D4.0-blue" alt="TypeScript version" />
  </p>
</p>

> **Automatyczne i ręczne układanie planów lekcji** • Express • Prisma • React • GLPK.js

---

## 📁 Struktura

```
/
├── backend/       # Express + Prisma + solver
├── frontend/      # React + Vite + UI
├── package.json   # workspaces & root scripts
└── README.md      # this file
```

---

## 🚀 Szybki start

```bash
# 1. Zainstaluj wszystkie dependencies
npm install

# 2. Uruchom development (backend + frontend równocześnie)
npm run dev
```

- **Backend**: http://localhost:3000  
- **Frontend**: http://localhost:5173  

---

## 🔗 Ważne skrypty

| Komenda             | Co robi                               |
|---------------------|---------------------------------------|
| `npm run dev`       | startuje backend & frontend           |
| `npm run dev:backend`  | startuje tylko backend (nodemon)  |
| `npm run dev:frontend` | startuje tylko frontend (Vite)   |

---

## 🛠️ Pod maską

- **backend/**  
  - `src/server.js` – Express + statyczne pliki  
  - `src/app.js` – middleware, routing  
  - `src/solver.js` – GLPK.js CP-SAT solver  
  - `src/services/` & `src/controllers/` – logika business / HTTP  
  - **Prisma**: `prisma/schema.prisma` + SQLite  
- **frontend/**  
  - `src/main.tsx` – punkt wejścia  
  - `src/App.tsx` & `src/routes/` – routing React Router  
  - `src/api/` – Axios + React Query client  
  - `src/features/…` – CRUD screens & Timetable view  

---

## 🤝 Autorzy

- Jan Jakubowski  
- Wiktor Alisch  

---

## 📖 TODO

- 🔒 Dodać role i uprawnienia  
- 🎨 Frontend i UI: drag-and-drop, korekty  
- 📦 Docker + CI/CD  
- 🧪 Testy E2E (Cypress, Jest + Supertest)  

---

<p align="center">
  Made with ❤️ by the DeepSchedule Team
</p>