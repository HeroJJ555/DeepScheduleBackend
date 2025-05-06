import React, { useState, useEffect } from 'react';
import
{
  useSchool,
  useUpdateSchool,
  useMembers,
  useInviteMember,
  useUpdateMember,
  useRemoveMember,
  useDeleteSchool
} from './useSchools';
import './manageSchoolModal.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal';

export default function ManageSchoolModal({ schoolId, isOpen, onClose })
{
  const [tab, setTab] = useState('info');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // szkoła
  const { data: school, isLoading: loadingSchool } = useSchool(schoolId);
  const updateSchool = useUpdateSchool();
  const deleteSchool = useDeleteSchool();

  // członkowie — fetch tylko w zakładce members
  const { data: members = [], isLoading: loadingMembers } =
    useMembers(schoolId, { enabled: isOpen && tab === 'members' });

  const invite     = useInviteMember(schoolId);
  const updateMem  = useUpdateMember(schoolId);
  const removeMem  = useRemoveMember(schoolId);

  // formularz info
  const [form, setForm] = useState({ name: '', type: '', address: '', city: '' });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('TEACHER');
  const [invitePos, setInvitePos] = useState('NAUCZYCIEL');

  useEffect(() =>
  {
    if (isOpen && school)
    {
      setForm({
        name:    school.name    || '',
        type:    school.type    || 'LO',
        address: school.address || '',
        city:    school.city    || ''
      });
    }
  }, [isOpen, school]);

  if (!isOpen) return null;

  const handleInfoSave = e =>
  {
    e.preventDefault();
    updateSchool.mutate(
      { id: schoolId, ...form },
      {
        onSuccess: () => toast.success('Zapisano dane szkoły'),
        onError:   err => toast.error(err.response?.data?.error || 'Błąd zapisu')
      }
    );
  };

  const handleInvite = e =>
  {
    e.preventDefault();
    invite.mutate(
      { email: inviteEmail, role: inviteRole, position: invitePos },
      {
        onSuccess: () => {
          toast.success('Zaproszono użytkownika');
          setInviteEmail('');
        },
        onError: err => toast.error(err.response?.data?.error || 'Błąd zaproszenia')
      }
    );
  };

  const handleMemberUpdate = (userId, role, pos) =>
    updateMem.mutate({ userId, role, position: pos }, {
      onSuccess: () => toast.success('Zmieniono uprawnienia'),
      onError:   () => toast.error('Błąd zmiany roli')
    });

  const handleMemberRemove = userId =>
    removeMem.mutate(userId,
    {
      onSuccess: () => toast.success('Usunięto z szkoły'),
      onError:   () => toast.error('Błąd usuwania')
    });

  const confirmDeleteSchool = () =>
  {
    deleteSchool.mutate(schoolId,
    {
      onSuccess: () =>
      {
        toast.success('Szkoła usunięta');
        setShowDeleteConfirm(false);
        onClose();
        navigate('/panel', { replace: true });
      },
      onError: err => {
        toast.error(err.response?.data?.error || 'Błąd usuwania szkoły');
        setShowDeleteConfirm(false);
      }
    });
  };

  return (
    <>
      <div className="msch-overlay" onClick={onClose}>
        <div className="msch-modal" onClick={e => e.stopPropagation()}>
          <header className="msch-header">
            <h3>Ustawienia szkoły</h3>
            <button className="msch-close" onClick={onClose}>×</button>
          </header>

          <nav className="msch-tabs">
            <button
              className={tab==='info' ? 'active' : ''}
              onClick={() => setTab('info')}
            >Informacje</button>
            <button
              className={tab==='members' ? 'active' : ''}
              onClick={() => setTab('members')}
            >Członkowie</button>
          </nav>

          <div className="msch-body">
            {tab === 'info' ? (
              <form className="msch-form" onSubmit={handleInfoSave}>
                <div className="msch-field">
                  <label>Typ szkoły</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f=>({ ...f, type: e.target.value }))}
                  >
                    {[
                      {label:'Liceum Ogólnokształcące',value:'LO'},
                      {label:'Technikum',value:'TECHNIKUM'},
                      {label:'Szkoła Branżowa',value:'BRANZOWA'}
                    ].map(o=>(
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="msch-field">
                  <label>Nazwa szkoły</label>
                  <input
                    value={form.name}
                    onChange={e=>setForm(f=>({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="msch-field">
                  <label>Adres</label>
                  <input
                    value={form.address}
                    onChange={e=>setForm(f=>({ ...f, address: e.target.value }))}
                  />
                </div>

                <div className="msch-field">
                  <label>Miasto</label>
                  <input
                    value={form.city}
                    onChange={e=>setForm(f=>({ ...f, city: e.target.value }))}
                  />
                </div>

                <div className="msch-actions-row">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateSchool.isLoading}
                  >
                    {updateSchool.isLoading ? 'Zapisywanie…' : 'Zapisz'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleteSchool.isLoading}
                  >
                    Usuń szkołę
                  </button>
                </div>
              </form>
            ) : (
              <section className="msch-members">
                <form className="msch-invite" onSubmit={handleInvite}>
                  <input
                    type="email"
                    placeholder="Email użytkownika"
                    value={inviteEmail}
                    onChange={e=>setInviteEmail(e.target.value)}
                    required
                  />
                  <select
                    value={inviteRole}
                    onChange={e=>setInviteRole(e.target.value)}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="TEACHER">TEACHER</option>
                  </select>
                  <select
                    value={invitePos}
                    onChange={e=>setInvitePos(e.target.value)}
                  >
                    <option value="DYREKTOR">Dyrektor</option>
                    <option value="VICE_DYREKTOR">Vice-Dyrektor</option>
                    <option value="NAUCZYCIEL">Nauczyciel</option>
                    <option value="KIEROWNIK_IT">Kierownik IT</option>
                  </select>
                  <button className="btn btn-primary">Zaproś</button>
                </form>

                {loadingMembers ? (
                  <p className="msch-loading">Ładowanie członków…</p>
                ) : (
                  <ul className="msch-list">
                    {members.map(m => (
                      <li key={m.userId}>
                        <div className="msch-member-info">
                          <strong>{m.user.name}</strong>
                          <span className="email">{m.user.email}</span>
                        </div>
                        <div className="msch-actions">
                          <select
                            value={m.role}
                            onChange={e=>handleMemberUpdate(m.userId, e.target.value, m.position)}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="TEACHER">TEACHER</option>
                          </select>
                          <select
                            value={m.position}
                            onChange={e=>handleMemberUpdate(m.userId, m.role, e.target.value)}
                          >
                            <option value="DYREKTOR">Dyrektor</option>
                            <option value="VICE_DYREKTOR">Vice-Dyrektor</option>
                            <option value="NAUCZYCIEL">Nauczyciel</option>
                            <option value="KIEROWNIK_IT">Kierownik IT</option>
                          </select>
                          <button
                            className="icon-button del"
                            onClick={()=>handleMemberRemove(m.userId)}
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
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          message="Czy na pewno chcesz usunąć tę szkołę? Operacji nie można cofnąć."
          onConfirm={confirmDeleteSchool}
          onCancel={()=>setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}