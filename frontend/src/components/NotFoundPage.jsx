import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';
 
export default function NotFoundPage()
{
  const nav = useNavigate();
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-text">
          Ups! Strona, której szukasz, nie istnieje.
        </p>
        <button
          className="btn-primary notfound-btn"
          onClick={() => nav(-1)}
        >
          Wróć
        </button>
      </div>
    </div>
  );
}