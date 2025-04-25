# DeepSchedule Backend (Node.js + AI)

> **Dokumentacja i changelog**

---

# Spis treści
## 1. Endpointy

--

# 1. Endpointy

## BEZ AUTORYZACJI

> **Publiczne operacje uwierzytelniania i przywracania hasła**

| Metoda | Ścieżka                         | Opis                                                                              | Body / Query                                                         |
|--------|---------------------------------|-----------------------------------------------------------------------------------|----------------------------------------------------------------------|
| POST   | `/auth/register`                | Rejestracja nowego konta (zakłada szkołę lub przypisanie do istniejącej)         | `{ email, password, name, schoolId? }`                               |
| POST   | `/auth/login`                   | Logowanie — zwraca JWT                                                            | `{ email, password }`                                                |
| POST   | `/auth/password-reset/request`  | Prośba o link/reset hasła — wysyła e-mail z tokenem                                | `{ email }`                                                          |
| POST   | `/auth/password-reset/confirm`  | Potwierdzenie nowego hasła za pomocą tokenu                                        | `{ token, newPassword }`                                             |
| GET    | `/health`                       | Prosta weryfikacja „alive” serwera                                                 | —                                                                    |

---

## Z AUTORYZACJĄ

> **Wszystkie poniższe żądania wymagają nagłówka**  
> `Authorization: Bearer <JWT>`

### Użytkownik (`/users`)

| Metoda | Ścieżka                 | Opis                                                     | Body / Query                  |
|--------|-------------------------|----------------------------------------------------------|-------------------------------|
| GET    | `/users/me`             | Pobierz dane zalogowanego użytkownika                    | —                             |
| PUT    | `/users/me`             | Edycja własnego profilu (np. zmiana hasła, nazwy)        | `{ name?, password? }`        |
| POST   | `/users/invite`         | Zaproś użytkownika do placówki (wysyła e-mail z linkiem) | `{ email, role, schoolId }`   |

### Szkoły (`/schools`)

| Metoda | Ścieżka               | Opis                                                  | Body / Query                     |
|--------|-----------------------|-------------------------------------------------------|----------------------------------|
| GET    | `/schools`            | Lista wszystkich placówek dostępnych dla konta        | `?page=&limit=`                  |
| POST   | `/schools`            | Utwórz nową placówkę                                  | `{ name, address, city, ... }`   |
| GET    | `/schools/:id`        | Pobierz szczegóły wybranej placówki                   | —                                |
| PUT    | `/schools/:id`        | Edytuj dane placówki                                  | `{ name?, address?, ... }`       |
| DELETE | `/schools/:id`        | Usuń placówkę (lub deaktywuj)                         | —                                |


### Nauczyciele (`/teachers`)

> **Scoped by school**: każdy użytkownik widzi tylko swoich nauczycieli.

| Metoda | Ścieżka                              | Opis                                   | Body / Query                              |
|--------|--------------------------------------|----------------------------------------|-------------------------------------------|
| GET    | `/schools/:schoolId/teachers`        | Lista nauczycieli w placówce           | `?page=&limit=&search=`                   |
| POST   | `/schools/:schoolId/teachers`        | Dodaj nowego nauczyciela               | `{ name, email?, subjects: [subjectId] }` |
| GET    | `/teachers/:teacherId`               | Szczegóły nauczyciela                  | —                                         |
| PUT    | `/teachers/:teacherId`               | Edytuj dane nauczyciela                | `{ name?, subjects? }`                    |
| DELETE | `/teachers/:teacherId`               | Usuń (lub deaktywuj) nauczyciela       | —                                         |


### Klasy (`/classes`)

| Metoda | Ścieżka                           | Opis                                   | Body / Query                                |
|--------|-----------------------------------|----------------------------------------|---------------------------------------------|
| GET    | `/schools/:schoolId/classes`      | Lista klas w placówce                  | `?page=&limit=&search=`                     |
| POST   | `/schools/:schoolId/classes`      | Dodaj nową klasę                       | `{ name, subjects: [{ subjectId, hours }] }`|
| GET    | `/classes/:classId`               | Szczegóły klasy                        | —                                           |
| PUT    | `/classes/:classId`               | Edytuj dane klasy                      | `{ name?, subjects? }`                      |
| DELETE | `/classes/:classId`               | Usuń (lub deaktywuj) klasę             | —                                           |

### Sale (`/rooms`)

| Metoda | Ścieżka                           | Opis                                   | Body / Query                    |
|--------|-----------------------------------|----------------------------------------|---------------------------------|
| GET    | `/schools/:schoolId/rooms`        | Lista sal w placówce                   | `?page=&limit=&search=`         |
| POST   | `/schools/:schoolId/rooms`        | Dodaj nową salę                        | `{ name, capacity? }`           |
| GET    | `/rooms/:roomId`                  | Szczegóły sali                         | —                               |
| PUT    | `/rooms/:roomId`                  | Edytuj dane sali                       | `{ name?, capacity? }`          |
| DELETE | `/rooms/:roomId`                  | Usuń (lub deaktywuj) salę              | —                               |

### Terminy (`/timeslots`)

| Metoda | Ścieżka                                 | Opis                                 | Body / Query              |
|--------|-----------------------------------------|--------------------------------------|---------------------------|
| GET    | `/schools/:schoolId/timeslots`          | Lista dostępnych slotów godzinowych  | —                         |
| POST   | `/schools/:schoolId/timeslots`          | Dodaj nowy slot (dzień, godzina)     | `{ day, hour }`           |
| DELETE | `/timeslots/:timeslotId`                | Usuń (lub wyłącz) slot               | —                         |

### Plan lekcji (`/timetable`)

| Metoda | Ścieżka                        | Opis                                                 | Body / Query             |
|--------|--------------------------------|------------------------------------------------------|--------------------------|
| POST   | `/generate`                    | Wygeneruj plan na podstawie danych w bazie           | — (używa seed i genera­tor) |
| GET    | `/timetable`                   | Pobierz zapisany, ostatnio wygenerowany plan         | —                        |
| DELETE | `/timetable`                   | Wyczyść wszystkie wpisy planu (np. przed kolejnym run)| —                       |
| GET | `/timetable/entries` | Zwraca listę aktualnych planów | —
| POST | `/timetable/entries` | Pozwala dodać nową lekcję ręcznie | —
| PUT | `/timetable/entries/:entryId` | Korekty ręczne | —
| DELETE | `/timetable/entries/:entryId` | Usuwa wpis | —
### Role i dostęp

- Każde żądanie **z autoryzacją** sprawdza JWT i pobiera `user.schoolId[]`  
- **Scoped resources**:  
  - Dostęp do `/schools/:id/*` jest dozwolony tylko, jeśli `:id` należy do `user.schoolId[]`.  
  - Przy CRUD na teacher/class/room/timeslot sprawdzamy przynależność do tej samej szkoły.  


*Kiedyś zrobię*