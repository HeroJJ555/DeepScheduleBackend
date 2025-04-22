# DeepSchedule Backend (Node.js + AI)

> **Dokumentacja i changelog** dla backendu aplikacji w Node.js, wykorzystującego **lekki algorytm AI** do generowania optymalnego planu lekcji.

---

## Spis treści

1. [Opis projektu](#opis-projektu)  
2. [Architektura](#architektura)  
3. [Wymagania wstępne](#wymagania-wstępne)  
4. [Instalacja](#instalacja)  
5. [Konfiguracja](#konfiguracja)  
6. [Struktura katalogów](#struktura-katalogów)  
7. [Schemat bazy danych](#schemat-bazy-danych)  
8. [AI Generator planu](#ai-generator-planu)  
9. [REST API](#rest-api)  
10. [Uruchamianie](#uruchamianie)  
11. [Changelog](#changelog)  

---

## Opis projektu

Ten backend w Node.js + Express pobiera dane z MySQL i generuje plan lekcji przy użyciu **Genetic Algorithm** – prostej metody AI inspirowanej biologiczną ewolucją. Gotowy plan zapisywany jest w tabeli `PlanLekcji`, a frontend może go pobrać przez REST API.

---

## Architektura

- **Express.js** — serwer HTTP  
- **mysql2** — klient MySQL  
- **Genetic Algorithm** — lekki algorytm AI do optymalizacji planu  
- **dotenv** — zarządzanie zmiennymi środowiskowymi  

---

## Wymagania wstępne

- Node.js v18+  
- npm lub yarn  
- Dostęp do bazy MySQL z już istniejącą schematą `s5_deepschedule`  

---

## Instalacja

```bash
cd backend
npm install
# lub
yarn install
```

---

## Konfiguracja

Utwórz plik `.env` w katalogu `backend/` z następującymi zmiennymi:

```ini
MYSQL_HOST=193.111.249.78
MYSQL_USER=u5_AF6h3cTZj3
MYSQL_PASSWORD=f.AY5y6GmUtdCD5Sx1=.bByx
MYSQL_DATABASE=s5_deepschedule
MYSQL_PORT=3306
PLAN_TABLE=PlanLekcji
PORT=5000
```

---

## Struktura katalogów

```
backend/
├── src/
│   ├── index.js           # Punkt wejścia (Express server)
│   ├── db.js              # Konfiguracja i inicjalizacja połączenia MySQL
│   ├── config.js          # Ładowanie zmiennych środowiskowych
│   ├── planGenerator.js   # AI: Genetic Algorithm do generowania planu
│   └── routes/
│       └── plan.js        # Definicja endpointów `/api/plan` i `/api/plan/generate`
├── .env                   # Zmienne środowiskowe (niewersjonowane)
└── package.json
```

---

## Schemat bazy danych

Źródłowe tabele:
- **Oddzial**(ID, Nazwa)  
- **Nauczyciel**(ID, Imie, Nazwisko, Rola, GodzinyDostepnosci, Etat)  
- **Przedmiot**(ID, Nazwa)  
- **Sala**(ID, Nazwa, Przeznaczenie, GodzinyDostepnosci)  
- **NauczycielOddzialPrzedmiot**(NauczycielID, OddzialID, PrzedmiotID, TygodnioweGodziny)  

Tabela wynikowa tworzone automatycznie:

```sql
CREATE TABLE IF NOT EXISTS PlanLekcji (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nauczyciel_id INT,
  oddzial_id INT,
  przedmiot_id INT,
  day INT,
  slot INT,
  room INT
);
```

---

## AI Generator planu

W pliku `src/planGenerator.js` zaimplementowany jest **Genetic Algorithm**:

1. **Reprezentacja**  
   - Chromosom = tablica długości `N` lekcji, gdzie każda gen to liczba całkowita ⟶ `(day, slot, room)` zakodowane skalarowo.  

2. **Funkcja kosztu (fitness)**  
   - Duża kara za konflikty:  
     - Ta sama klasa (oddział), nauczyciel lub sala w tym samym (dzień, slot).  
   - Bonusy (ujemny koszt) za:  
     - Kolejne lekcje tego samego przedmiotu w kolejnych slotach.  
     - Brak lub minimalne „okienka” (luki) między lekcjami w dniu.  

3. **Operator selekcji**  
   - Tournament selection (turniej dwóch losowych osobników).  

4. **Crossover**  
   - Jednopunktowy crossover na chromosomie.  

5. **Mutacja**  
   - Z losowym prawdopodobieństwem mutujemy gen (nowy, losowy `(day,slot,room)`).  

6. **Algorytm**  
   - Inicjalizacja populacji losowych planów.  
   - Pętla ewolucji:  
     - Selekcja par rodziców → crossover → mutacja → ocena nowej generacji.  
     - Zachowujemy elitę (najlepsze `k`).  
     - Kończymy po `maxGenerations` lub stagnacji najlepszego fitness.  

---

## REST API

### GET `/api/plan`

Pobiera aktualny plan z tabeli `PlanLekcji`:

```json
[
  {
    "id": 1,
    "nauczyciel_id": 2,
    "oddzial_id": 1,
    "przedmiot_id": 3,
    "day": 0,
    "slot": 2,
    "room": 1
  },
  ...
]
```

### POST `/api/plan/generate`

Wywołuje proces generacji AI:

1. Czyści i tworzy tabelę `PlanLekcji` (jeśli pusta, tworzy).  
2. Uruchamia Genetic Algorithm.  
3. Zapisuje wygenerowany plan.  
4. Zwraca nowy plan jako JSON (jak powyżej).

---

## Uruchamianie

```bash
cd backend
npm start
```

Serwer działa domyślnie na `http://localhost:5000`.

---

## Changelog

### v2.0.0 (2025-04-20)
- Pełny rewrite backendu w Node.js + Express  
- Zamiast ciężkich frameworków ML zastosowano Genetic Algorithm jako **lightweight AI**  
- Dodano API REST:  
  - **GET** `/api/plan`  
  - **POST** `/api/plan/generate`  
- Automatyczne tworzenie i zapis planu do MySQL  

---

*Dokument wygenerowany automatycznie.*  