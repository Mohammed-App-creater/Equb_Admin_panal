
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import EqubLayout from '../layouts/EqubLayout';

import Dashboard from '../pages/Dashboard';
import Equbs from '../pages/Equbs';
import EqubOverview from '../pages/EqubOverview';
import Login from '../pages/Login';
import Members from '../pages/Members';
import Payments from '../pages/Payments';
import Lottery from '../pages/Lottery';
import Reports from '../pages/Reports';
import ReportsList from '../pages/ReportsList';
import Activity from '../pages/Activity';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="equbs" element={<Equbs />} />
        
        {/* Equb Scoped Routes with Layout */}
        <Route path="equbs/:id" element={<EqubLayout />}>
          <Route index element={<EqubOverview />} />
          <Route path="members" element={<Members />} />
          <Route path="payments" element={<Payments />} />
          <Route path="lottery" element={<Lottery />} />
          <Route path="reports" element={<Reports />} />
          <Route path="activity" element={<Activity />} />
        </Route>

        <Route path="reports" element={<ReportsList />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
