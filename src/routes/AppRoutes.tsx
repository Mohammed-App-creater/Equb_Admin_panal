import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Equbs from "../pages/Equbs";
import Login from "../pages/Login";
import Members from "../pages/Members";
import Payments from "../pages/Payments";
import Lottery from "../pages/Lottery";
import Reports from "../pages/Reports";
import Activity from "../pages/Activity";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import EqubLayout from "../layouts/EqubLayout";
import EqubOverview from "../pages/EqubOverview";
import ReportsList from "../pages/ReportsList";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="equbs" element={<Equbs />} />

        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />

        {/* Dynamic Equb Routes */}
        <Route path="equbs/:id" element={<EqubLayout />}>
          <Route index element={<EqubOverview />} />
          <Route path="members" element={<Members />} />
          <Route path="payments" element={<Payments />} />
          <Route path="lottery" element={<Lottery />} />
          <Route path="reports" element={<Reports />} />
          <Route path="activity" element={<Activity />} />
        </Route>

        <Route path="reports" element={<ReportsList />} />

        {/* Placeholder routes */}
        <Route
          path="members"
          element={
            <div className="p-8 text-center text-muted-foreground">
              Global members list coming soon
            </div>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
