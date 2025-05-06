import React, { useState } from "react";
import { useCreateSchool } from "./useSchools";
import "./createSchoolModal.css";
import { toast } from "react-toastify";

const SCHOOL_TYPES = [
  { label: "Liceum Ogólnokształcące", value: "LO" },
  { label: "Technikum", value: "TECHNIKUM" },
  { label: "Szkoła Branżowa", value: "BRANZOWA" },
];

const USER_ROLES = [
  { label: "Dyrektor", value: "DYREKTOR" },
  { label: "Vice-Dyrektor", value: "VICE_DYREKTOR" },
  { label: "Nauczyciel", value: "NAUCZYCIEL" },
  { label: "Kierownik IT", value: "KIEROWNIK_IT" },
];

export default function CreateSchoolModal({ isOpen, onClose })
{
  const createSchool = useCreateSchool();
  const [form, setForm] = useState({
    type: "LO",
    position: "DYREKTOR",
    name: "",
    address: "",
    city: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    createSchool.mutate(form, {
      onSuccess: () => {
        onClose();
        toast.success("Szkoła utworzona!");
      },
      onError: err => {
        toast.error(err.response?.data?.error || "Coś poszło nie tak");
      }
    });
  };

  if (!isOpen) return null;

  const { type, position, name, address, city } = form;

  return (
    <div className="csm-overlay" onClick={onClose}>
      <div className="csm-modal" onClick={e => e.stopPropagation()}>
        <h3>Utwórz nową szkołę</h3>
        <form onSubmit={handleSubmit} className="csm-form">
          <label>
            Typ szkoły
            <select
              name="type"
              value={type}
              onChange={handleChange}
            >
              {SCHOOL_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Twoja rola w szkole
            <select
              name="position"
              value={position}
              onChange={handleChange}
            >
              {USER_ROLES.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Pełna nazwa szkoły
            <input
              name="name"
              type="text"
              value={name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Adres
            <input
              name="address"
              type="text"
              value={address}
              onChange={handleChange}
            />
          </label>

          <label>
            Miasto
            <input
              name="city"
              type="text"
              value={city}
              onChange={handleChange}
            />
          </label>

          <div className="csm-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createSchool.isLoading}
            >
              {createSchool.isLoading ? "Tworzenie…" : "Utwórz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}