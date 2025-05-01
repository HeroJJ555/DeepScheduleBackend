import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from './components/Footer';
import './App.css';

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="app-content">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}
