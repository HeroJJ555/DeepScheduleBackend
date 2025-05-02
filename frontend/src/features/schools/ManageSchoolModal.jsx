import React, { useState, useEffect } from "react";
import {
  useSchool,
  useUpdateSchool,
  useMembers,
  useInviteMember,
  useUpdateMember,
  useRemoveMember,
} from "./useSchools";
import "./manageSchoolModal.css";
import { useDeleteSchool } from "./useSchools";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SCHOOL_TYPES = [
  { label: "Liceum Ogólnokształcące", value: "LO" },
  { label: "Technikum", value: "TECHNIKUM" },
  { label: "Szkoła Branżowa", value: "BRANZOWA" },
];
const SCHOOL_ROLES = [
  { label: "ADMIN", value: "ADMIN" },
  { label: "TEACHER", value: "TEACHER" },
];
const USER_POSITIONS = [
  { label: "Dyrektor", value: "DYREKTOR" },
  { label: "Vice-Dyrektor", value: "VICE_DYREKTOR" },
  { label: "Nauczyciel", value: "NAUCZYCIEL" },
  { label: "Kierownik IT", value: "KIEROWNIK_IT" },
];

export default function ManageSchoolModal({ schoolId, isOpen, onClose }) {
  // Ogólne dane szkoły
  const { data: school, isLoading: loadingSchool } = useSchool(schoolId);
  const updateSchool = useUpdateSchool();
  const deleteSchool = useDeleteSchool();
  const navigate = useNavigate();

  // Członkowie

  const invite = useInviteMember(schoolId);
  const updateMem = useUpdateMember(schoolId);
  const removeMem = useRemoveMember(schoolId);

  // Local state
  const [tab, setTab] = useState("info"); // 'info' | 'members'
  const [form, setForm] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
  });

  const { data: members = [], isLoading: loadingMembers } = useMembers(
    schoolId,
    { enabled: isOpen && tab === "members" }
  );

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("TEACHER");
  const [invitePos, setInvitePos] = useState("NAUCZYCIEL");

  // Gdy otwieramy modal, wypełniamy form danymi
  useEffect(() => {
    if (isOpen && school) {
      setForm({
        name: school.name || "",
        type: school.type || "LO",
        address: school.address || "",
        city: school.city || "",
      });
    }
  }, [isOpen, school]);

  if (!isOpen) return null;

  // Handlery
  const handleInfoSave = (e) => {
    e.preventDefault();
    updateSchool.mutate(
      { id: schoolId, ...form },
      {
        onSuccess: () => toast.success("Zapisano dane szkoły"),
        onError: (err) =>
          toast.error(err.response?.data?.error || "Błąd zapisu"),
      }
    );
  };

  const handleInvite = (e) => {
    e.preventDefault();
    invite.mutate(
      { email: inviteEmail, role: inviteRole, position: invitePos },
      {
        onSuccess: () => {
          toast.success("Zaproszono użytkownika");
          setInviteEmail("");
        },
        onError: (err) =>
          toast.error(err.response?.data?.error || "Błąd zaproszenia"),
      }
    );
  };

  const handleMemberUpdate = (userId, role, pos) =>
    updateMem.mutate(
      { userId, role, position: pos },
      {
        onSuccess: () => toast.success("Zmieniono uprawnienia"),
        onError: () => toast.error("Błąd zmiany roli"),
      }
    );

  const handleMemberRemove = (userId) =>
    removeMem.mutate(userId, {
      onSuccess: () => toast.success("Usunięto z szkoły"),
      onError: () => toast.error("Błąd usuwania"),
    });

  return (
    <div className="msch-overlay" onClick={onClose}>
      <div className="msch-modal" onClick={(e) => e.stopPropagation()}>
        <header className="msch-header">
          <h3>Ustawienia szkoły</h3>
          <button className="msch-close" onClick={onClose}>
            ×
          </button>
        </header>

        <nav className="msch-tabs">
          <button
            className={tab === "info" ? "active" : ""}
            onClick={() => setTab("info")}
          >
            Informacje
          </button>
          <button
            className={tab === "members" ? "active" : ""}
            onClick={() => setTab("members")}
          >
            Członkowie
          </button>
        </nav>

        {tab === "info" ? (
          <form className="msch-form" onSubmit={handleInfoSave}>
            <label>
              Typ szkoły
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
              >
                {SCHOOL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nazwa
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Adres
              <input
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
              />
            </label>
            <label>
              Miasto
              <input
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
              />
            </label>
            <button type="submit" className="btn-primary">
              {updateSchool.isLoading ? "Zapisywanie…" : "Zapisz"}
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                if (window.confirm("Czy na pewno chcesz usunąć tę szkołę?")) {
                  deleteSchool.mutate(schoolId, {
                    onSuccess: () => {
                      toast.success("Szkoła usunięta");
                      onClose();
                      navigate("/panel");
                    },
                    onError: (err) => {
                      toast.error(
                        err.response?.data?.error || "Błąd usuwania szkoły"
                      );
                    },
                  });
                }
              }}
              disabled={deleteSchool.isLoading}
            >
              {deleteSchool.isLoading ? "Usuwanie…" : "Usuń szkołę"}
            </button>
          </form>
        ) : (
          <section className="msch-members">
            <form className="msch-invite" onSubmit={handleInvite}>
              <input
                type="email"
                placeholder="Email użytkownika"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                {SCHOOL_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <select
                value={invitePos}
                onChange={(e) => setInvitePos(e.target.value)}
              >
                {USER_POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary">
                Zaproś
              </button>
            </form>

            {loadingMembers ? (
              <p>Ładowanie…</p>
            ) : (
              <ul className="msch-list">
                {members.map((m) => (
                  <li key={m.userId}>
                    <span>
                      {m.user.name} ({m.user.email})
                    </span>
                    <div className="msch-actions">
                      <select
                        value={m.role}
                        onChange={(e) =>
                          handleMemberUpdate(
                            m.userId,
                            e.target.value,
                            m.position
                          )
                        }
                      >
                        {SCHOOL_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={m.position}
                        onChange={(e) =>
                          handleMemberUpdate(m.userId, m.role, e.target.value)
                        }
                      >
                        {USER_POSITIONS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="icon-button del"
                        onClick={() => handleMemberRemove(m.userId)}
                        title="Usuń"
                      >
                        <i className="fa-solid fa-user-minus"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
