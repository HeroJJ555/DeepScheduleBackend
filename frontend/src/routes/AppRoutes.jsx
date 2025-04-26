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
import CreateSchoolPage from "../features/schools/CreateSchoolPage";
import SchoolsPage from "../features/schools/SchoolsPage";
import SupportPage from "../features/support/SupportPage";
import ClassesPage from "../features/classes/ClassesPage";
import TeachersPage from "../features/teachers/TeachersPage";
import RoomsPage from "../features/rooms/RoomsPage";
import GeneratePage from "../features/timetable/GeneratePage";
import TimetableView from "../features/timetable/TimetableView";

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
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/panel/schools" element={<SchoolsPage />} />
          <Route path="/panel/schools/new" element={<CreateSchoolPage />} />
          <Route
            path="/panel/schools/:schoolId/classes"
            element={<ClassesPage />}
          />
          <Route
            path="/panel/schools/:schoolId/classes"
            element={<ClassesPage />}
          />
          <Route
            path="/panel/schools/:schoolId/teachers"
            element={<TeachersPage />}
          />
          <Route
            path="/panel/schools/:schoolId/rooms"
            element={<RoomsPage />}
          />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/timetable" element={<TimetableView />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
