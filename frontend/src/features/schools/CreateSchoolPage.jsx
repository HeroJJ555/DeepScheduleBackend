//Za co jest to odpowiedzialne?
import React from 'react';
import { useCreateSchool } from './useSchools';
import SchoolForm from './SchoolForm';
import { useNavigate } from 'react-router-dom';

export default function CreateSchoolPage()
{
  const createSchool = useCreateSchool();
  const navigate = useNavigate();

  const handleSubmit = data => {
    createSchool.mutate(data, {
      onSuccess: school => {
        navigate(`/schools/${school.id}/classes`);
      }
    });
  };

  return (
    <section className="section">
      <h2>Utwórz szkołę</h2>
      <SchoolForm
        initial={{}}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </section>
  );
}
