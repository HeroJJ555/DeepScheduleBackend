# DeepScheduleBackend

Backend **DeepSchedule** — system automatycznego i ręcznego układania planów lekcji.  
Opiera się na Node.js (ESM), Express, Prisma (SQLite) i solverze GLPK.js (WASM).

---

## Spis treści

- [Funkcjonalność](#funkcjonalność)  
- [Technologie](#technologie)  
- [Instalacja i uruchomienie](#uruchomienie)  
- [Struktura projektu](#struktura-projektu)  
- [Zmienne środowiskowe](#zmienne-środowiskowe)  
- [Baza danych (Prisma)](#baza-danych-prisma)  
- [API — lista endpointów](#api--lista-endpointów)  
  - [Publiczne (bez JWT)](#publiczne-bez-jwt)  
  - [Zabezpieczone (z JWT)](#zabezpieczone-z-jwt)  
- [Solver (GLPK.js)](#solver-glpkjs)  
- [Frontend](#frontend)  
- [Możliwe usprawnienia](#możliwe-usprawnienia)  

---

## Funkcjonalność

1. **Rejestracja, logowanie, reset hasła**  
2. **CRUD** dla:
   - użytkowników (`/users`),  
   - szkół (`/schools`),  
   - nauczycieli (`/teachers`),  
   - klas (`/classes`),  
   - sal (`/rooms`),  
   - slotów godzinowych (`/timeslots`),  
3. **Generowanie planu** (`/generate`) i **pobieranie** (`/timetable`),  
4. **Manualne poprawki** wpisów planu (`/entries`).  

---

## Technologie

- **Node.js** (v18+), **ES Modules**  
- **Express** — serwer HTTP  
- **Prisma** + SQLite — ORM i baza  
- **GLPK.js** (WASM) — solver CP-SAT  
- **AJV** + `ajv-formats` — walidacja JSON  
- **bcrypt**, **jsonwebtoken** — uwierzytelnianie  
- **jest**, **supertest** (opcjonalnie) — testy  

---

## Uruchomienie
   Domyślnie nasłuchuje:  
   ```
   http://localhost:3000
   ```

---

## Struktura projektu

```
├── .env
├── prisma/
│   └── schema.prisma       # modele i relacje
├── src/
│   ├── config/
│   │   └── index.js        # .env → config
│   ├── db.js               # inicjalizacja Prisma Client
│   ├── app.js              # Express + middleware + routes
│   ├── server.js           # punkt wejścia + statyczne pliki
│   ├── solver.js           # GLPK.js solver
│   ├── middleware/
│   │   ├── auth.js         # JWT
│   │   ├── errorHandler.js # globalny error handler
│   │   └── validateSchema.js # AJV
│   ├── utils/
│   │   ├── logger.js       # console wrapper
│   │   ├── email.js        # stub mailer
│   │   └── schemaDefs.js   # JSON-schemy
│   ├── routes/             # express.Router dla zasobów
│   ├── controllers/        # HTTP → services
│   └── services/           # logika biznesowa + DB + solver
└── frontend/               # statyczne UI (jeśli serwowane)
```

---

## Zmienne środowiskowe

W pliku `.env`:

```dotenv
DATABASE_URL="file:./dev.db"
JWT_SECRET="długi_bezpieczny_secret"
PORT=3000
```

---

## Baza danych (Prisma)

Modele w `prisma/schema.prisma`:

- **User**, **School**, **Teacher**, **Class**, **Room**, **TimeSlot**, **TimetableEntry**  
- **SchoolOnUser** (n:m User↔School)  
- **ClassSubject** (n:m Class↔Subject + liczba godzin)  
- **TeacherSubject** (n:m Teacher↔Subject)  

Każdy relacyjny model ma pole odwrotne np. `Class -> classSubjects`, `Subject -> classSubjects, teacherSubjects`.

---

## API — lista endpointów

### Publiczne (bez JWT)

| Metoda | Ścieżka                          | Opis                                      |
|--------|----------------------------------|-------------------------------------------|
| POST   | `/auth/register`                 | Rejestracja (`{email,password,name}`)     |
| POST   | `/auth/login`                    | Logowanie (`{email,password}`) → JWT      |
| POST   | `/auth/password-reset/request`   | Prośba o reset (`{email}`)                |
| POST   | `/auth/password-reset/confirm`   | Reset hasła (`{token,newPassword}`)       |
| GET    | `/health`                        | „Alive” check                             |

### Zabezpieczone (z JWT; `Authorization: Bearer <token>`)

#### Użytkownik `/users`

| Metoda | Ścieżka            | Opis                                 | Body                         |
|--------|--------------------|--------------------------------------|------------------------------|
| GET    | `/users/me`        | Pobierz własne dane                  | —                            |
| PUT    | `/users/me`        | Edycja nazwy i/lub hasła             | `{name?,password?}`          |
| POST   | `/users/invite`    | Zaproś do szkoły                     | `{email,role,schoolId}`      |

#### Szkoły `/schools`

| Metoda | Ścieżka            | Opis                     | Body `{name,address?,city?}` |
|--------|--------------------|--------------------------|------------------------------|
| GET    | `/schools`         | Lista dostępnych szkół   | —                            |
| POST   | `/schools`         | Nowa szkoła              | —                            |
| GET    | `/schools/:id`     | Szczegóły                | —                            |
| PUT    | `/schools/:id`     | Edycja                   | —                            |
| DELETE | `/schools/:id`     | Usuń                      | —                            |

#### Nauczyciele `/schools/:schoolId/teachers` & `/teachers/:teacherId`

CRUD nauczycieli w danej szkole.

#### Klasy `/schools/:schoolId/classes` & `/classes/:classId`

CRUD klas.

#### Sale `/schools/:schoolId/rooms` & `/rooms/:roomId`

CRUD sal.

#### Sloty `/schools/:schoolId/timeslots` & `/timeslots/:timeslotId`

CRUD slotów.

#### Plan lekcji

| Metoda | Ścieżka        | Opis                            | Body         |
|--------|----------------|---------------------------------|--------------|
| POST   | `/generate`    | Generuje i zapisuje plan        | —            |
| GET    | `/timetable`   | Pobiera ostatni zapisany plan   | —            |
| DELETE | `/timetable`   | Czyści wszystkie wpisy planu    | —            |

#### Manualne wpisy `/entries`

| Metoda | Ścieżka                 | Opis                                    | Body                                   |
|--------|-------------------------|-----------------------------------------|----------------------------------------|
| GET    | `/entries`              | Lista wszystkich wpisów planu           | —                                      |
| POST   | `/entries`              | Dodaj jeden wpis                        | `{classId,subjectId,timeslotId,roomId?,teacherId?}` |
| PUT    | `/entries/:entryId`     | Edytuj wpis                             | dowolne pola z powyższego               |
| DELETE | `/entries/:entryId`     | Usuń wpis                               | —                                      |

---

## Solver (GLPK.js)

- **Wejście** (`generateTimetable`):
  ```js
  {
    teachersMap: { [teacherId]: [subjectId,…] },
    classIds:    [classId,…],
    subjectsMap: { [classId]: { [subjectId]: hours } },
    timeslots:   [ {id,day,hour}, … ]
  }
  ```
- **buildModel**: zmienne binarne, constraints:
  - każda klasa ma dokładnie `hours` lekcji z `subject`,
  - każdy nauczyciel max 1 lekcja/slot.
- **solveModel** → GLPK CP-SAT.
- **parseSolution** → tablica `{classId,subjectId,timeslotId}`.

---

## Frontend

- TODO...

---

## Możliwe usprawnienia

- **Optymalizacja** solvera (funkcja celu, block scheduling).  
- **Roles & permissions** rozszerzone (np. dyrektor vs nauczyciel).  
- **Webhooki / powiadomienia** (np. e-mail, Slack).  


_Created by DeepSchedule Team (JJ & WA)_  
