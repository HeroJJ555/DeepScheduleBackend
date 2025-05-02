import React from 'react';
import './confirmModal.css';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="cm-overlay" onClick={onCancel}>
      <div className="cm-modal" onClick={e=>e.stopPropagation()}>
        <p className="cm-message">{message}</p>
        <div className="cm-buttons">
          <button className="btn btn-secondary" onClick={onCancel}>
            Anuluj
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Usuń
          </button>
        </div>
      </div>
    </div>
);
}
