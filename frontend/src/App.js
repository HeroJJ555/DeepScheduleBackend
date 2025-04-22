import { useState } from "react";
import "./App.css";
import LessonCell from "./components/LessonCell";

function App() {
  const dni = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
  const godziny = [
    "7:10–7:55",
    "8:00–8:45",
    "8:55–9:40",
    "9:50–10:35",
    "10:45–11:30",
    "11:50–12:35",
    "12:45–13:30",
    "13:40–14:25",
    "14:35–15:20",
    "15:25–16:10"
  ];

  const [plan, setPlan] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Formularz
  const [numClasses, setNumClasses] = useState("");
  const [teachersInput, setTeachersInput] = useState("");
  const [subjectsInput, setSubjectsInput] = useState("");

  const handleGenerate = () => {
    const classPlans = [];
    const num = parseInt(numClasses, 10);

    for (let i = 0; i < num; i++) {
      classPlans.push({
        "Poniedziałek": ["", "", "", "", "", "", "", "", "", ""],
        "Wtorek": ["", "", "", "", "", "", "", "", "", ""],
        "Środa": ["", "", "", "", "", "", "", "", "", ""],
        "Czwartek": ["", "", "", "", "", "", "", "", "", ""],
        "Piątek": ["", "", "", "", "", "", "", "", "", ""]
      });
    }

    setPlan(classPlans);
    setSelectedLesson(null);
  };

  const handleDrop = (from, to) => {
    const updatedPlan = [...plan];
    const temp = updatedPlan[from.classIndex][from.day][from.hour];
    updatedPlan[from.classIndex][from.day][from.hour] = updatedPlan[to.classIndex][to.day][to.hour];
    updatedPlan[to.classIndex][to.day][to.hour] = temp;
    setPlan(updatedPlan);
  };

  const handleHover = (day, hour) => {
    if (isDragging) return;
    if (!day || hour === null || hour === undefined) {
      setSelectedLesson(null);
      return;
    }
    const subject = plan[0][day][hour]; // domyślna klasa do hoveru
    if (!subject) {
      setSelectedLesson(null);
      return;
    }
    setSelectedLesson({ day, hour });
    setTeacherName("Przykładowy nauczyciel");
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>DeepSchedule</h1>
        <p>Inteligentny generator planów lekcji</p>
      </header>

      <main className="main-content">
        {plan ? (
          plan.map((klasaPlan, classIndex) => (
            <div key={classIndex} style={{ marginBottom: "40px" }}>
              <h2>Klasa {classIndex + 1}</h2>
              <table className="timetable">
                <thead>
                  <tr>
                    <th>Godzina</th>
                    {dni.map((dzien) => (
                      <th key={dzien}>{dzien}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {godziny.map((przedzial, godzina) => (
                    <tr key={godzina}>
                      <td>{przedzial}</td>
                      {dni.map((dzien) => {
                        const subject = klasaPlan[dzien][godzina];
                        const isSelected = false;
                        return (
                          <LessonCell
                            key={`${classIndex}-${dzien}-${godzina}`}
                            day={dzien}
                            hour={godzina}
                            subject={subject}
                            isSelected={isSelected}
                            teacher={teacherName}
                            onDrop={(from, to) =>
                              handleDrop(
                                { ...from, classIndex },
                                { ...to, classIndex }
                              )
                            }
                            onHover={(d, h) => handleHover(d, h)}
                            setIsDragging={setIsDragging}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="form-container">
            <label>
              Liczba klas:
              <input
                type="number"
                min="1"
                value={numClasses}
                onChange={(e) => setNumClasses(e.target.value)}
              />
            </label>
            <label>
              Nauczyciele (oddziel przecinkami):
              <input
                type="text"
                value={teachersInput}
                onChange={(e) => setTeachersInput(e.target.value)}
              />
            </label>
            <label>
              Przedmioty (oddziel przecinkami):
              <input
                type="text"
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
              />
            </label>

            <button
              className="btn"
              onClick={handleGenerate}
              disabled={
                !numClasses ||
                !teachersInput.trim() ||
                !subjectsInput.trim()
              }
            >
              Generuj plan
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        © 2025 DeepSchedule. Wersja 0.1 • Stworzono z React.
      </footer>
    </div>
  );
}

export default App;