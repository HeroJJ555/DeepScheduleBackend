let payload = null;


async function fetchTimetable(data) {
  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Nieznany błąd serwera");
  return json.timetable;
}

function renderTimetable(container, timetable) {
  container.innerHTML = "";
  const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

  for (const [cls, sessions] of Object.entries(timetable)) {
    const section = document.createElement("section");
    section.innerHTML = `<h2>Klasa ${cls}</h2>`;

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headerRow.innerHTML =
      `<th>Godzina \\ Dzień</th>` + days.map((d) => `<th>${d}</th>`).join("");
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let hour = 0; hour < 6; hour++) {
      const row = document.createElement("tr");
      row.innerHTML =
        `<th>Godzina ${hour + 1}</th>` +
        days
          .map((_, dayIdx) => {
            const sess = sessions.find(
              (s) => s.day === dayIdx && s.hour === hour
            );
            return `<td>${sess ? sess.subject : ""}</td>`;
          })
          .join("");
      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    section.appendChild(table);
    container.appendChild(section);
  }
}

async function loadExample() {
  const res = await fetch("/data/example-input.json");
  payload = await res.json();
  document.getElementById("generateBtn").disabled = false;
  alert("Załadowano przykładowe dane.");
}

function handleFileSelect(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      payload = JSON.parse(reader.result);
      document.getElementById("generateBtn").disabled = false;
      alert(`Wczytano dane z pliku ${file.name}`);
    } catch {
      alert("Plik nie jest poprawnym JSON-em.");
    }
  };
  reader.readAsText(file);
}

function attachEvents() {
  document.getElementById("loadExample").addEventListener("click", loadExample);

  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileSelect);

  document.getElementById("generateBtn").addEventListener("click", async () => {
    if (!payload) return;
    const container = document.getElementById("timetable");
    container.innerHTML = "<p>Generuję plan…</p>";
    try {
      const tt = await fetchTimetable(payload);
      renderTimetable(container, tt);
    } catch (e) {
      container.innerHTML = `<p class="error">Błąd: ${e.message}</p>`;
    }
  });
}

attachEvents();
