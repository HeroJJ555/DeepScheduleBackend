// src/features/rooms/RoomsPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRooms } from './useRooms';
import { useSubjects } from '../subjects/useSubjects';
import ManageRoomsModal from './ManageRoomsModal';

export default function RoomsPage() {
  const { schoolId } = useParams();
  const sid = Number(schoolId);

  const { data: rooms = [], isLoading: loadingRooms } = useRooms(sid, { enabled: true });
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects(sid, { enabled: true });

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loadingRooms || loadingSubjects) {
    return <p>Ładowanie danych…</p>;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>Sale</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Zarządzaj salami
        </button>
      </header>

      <ul className="list-group">
        {rooms.map(room => (
          <li key={room.id} className="list-group-item">
            <strong>{room.name}</strong>
            <br />
            Przeznaczenie:{" "}
            {room.specialSubjects.length > 0
              ? room.specialSubjects.map(s => s.name).join(", ")
              : "Brak"}
          </li>
        ))}
      </ul>

      <ManageRoomsModal
        schoolId={sid}
        subjects={subjects}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
