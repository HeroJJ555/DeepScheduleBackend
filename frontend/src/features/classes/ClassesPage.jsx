// src/features/classes/ClassesPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSubjects } from '../subjects/useSubjects';
import { useTeachers } from '../teachers/useTeachers';
import ManageClassesModal from './ManageClassesModal';

export default function ClassesPage() {
  const { schoolId } = useParams();
  const sid = Number(schoolId);
  const { data: subjects = [], isLoading: loadingSubj } = useSubjects(sid);
  const { data: teachers = [], isLoading: loadingTeach } = useTeachers(sid);
  const [isOpen, setIsOpen] = useState(false);

  if (loadingSubj || loadingTeach) return <p>Ładowanie danych…</p>;

  return (
    <div className="page-container">
      <h2>Klasy</h2>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Zarządzaj klasami
      </button>
      <ManageClassesModal
        schoolId={sid}
        subjects={subjects}
        teachers={teachers}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
