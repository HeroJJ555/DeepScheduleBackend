import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NotFoundPage from "../components/NotFoundPage";
import RegisterPage from "../auth/RegisterPage";
import LoginPage from "../auth/LoginPage";
import HomePage from "../features/home/HomePage";
import PanelPage from "../features/panel/PanelPage";
import ProfilePage from "../features/profile/ProfilePage";
import AnnouncementsPage from "../features/announcements/AnnouncementsPage";
import ChangeLogPage from "../features/changelog/ChangeLogPage";
import WikiPage from "../features/wiki/WikiPage";
import SupportPage from "../features/support/SupportPage";

import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "../components/ProtectedRoute";
console.log("🏠 HomePage render");
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/wiki" element={<WikiPage />} />
      <Route path="/support" element={<SupportPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/panel" element={<PanelPage />} />
          <Route path="/panel/profile" element={<ProfilePage />} />
          <Route path="/panel/announcements" element={<AnnouncementsPage />} />
          <Route path="/panel/changelog" element={<ChangeLogPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
