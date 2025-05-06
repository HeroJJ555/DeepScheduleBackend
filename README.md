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
  <h3 align="center">DeepSchedule</h3>

![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
    ![Canva](https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white)
    ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
    ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
    ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
    ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
    ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
    ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)
    ![Keras](https://img.shields.io/badge/Keras-%23D00000.svg?style=for-the-badge&logo=Keras&logoColor=white)
    ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
    ![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
    ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
    ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
    ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
    
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