//Za co jest to odpowiedzialne?
import React, { useState } from 'react';
import
{
  useSchools,
  useCreateSchool,
  useUpdateSchool,
  useDeleteSchool
} from './useSchools';
import SchoolForm from './SchoolForm';


export default function SchoolsPage()
{
  const { data: schools = [], isLoading } = useSchools();
  const createSchool = useCreateSchool();
  const updateSchool = useUpdateSchool();
  const deleteSchool = useDeleteSchool();

  const [editing, setEditing]   = useState(null);
  const [isCreating, setCreating] = useState(false);

  if (isLoading) return <p>Ładowanie szkół…</p>;

  return (
    <div>
      <h2>Szkoły</h2>
      <button
        className="btn-primary"
        onClick={() => { setCreating(true); setEditing(null); }}
      >
        + Nowa szkoła
      </button>

      {(isCreating || editing) && (
        <SchoolForm
          initial={editing || {}}
          onSubmit={data => {
            const mut = data.id
              ? updateSchool.mutate
              : createSchool.mutate;
            mut(data, {
              onSuccess: () => {
                setCreating(false);
                setEditing(null);
              }
            });
          }}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Adres</th>
            <th>Miasto</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {schools.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.city}</td>
              <td>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setEditing(s);
                    setCreating(false);
                  }}
                >
                  Edytuj
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteSchool.mutate(s.id)}
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
          {schools.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Brak szkół do wyświetlenia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}