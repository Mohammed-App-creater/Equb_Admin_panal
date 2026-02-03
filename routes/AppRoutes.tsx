
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Equbs from '../pages/Equbs';
import Login from '../pages/Login';
import Members from '../pages/Members';
import Payments from '../pages/Payments';
import Lottery from '../pages/Lottery';
import Reports from '../pages/Reports';
import Activity from '../pages/Activity';
import Notifications from '../pages/Notifications';

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
        
        <Route path="notifications" element={<Notifications />} />

        {/* Dynamic Equb Routes */}
        <Route path="equbs/:id/members" element={<Members />} />
        <Route path="equbs/:id/payments" element={<Payments />} />
        <Route path="equbs/:id/lottery" element={<Lottery />} />
        <Route path="equbs/:id/reports" element={<Reports />} />
        <Route path="equbs/:id/activity" element={<Activity />} />

        {/* Placeholder routes */}
        <Route path="members" element={<div className="p-8 text-center text-muted-foreground">Global members list coming soon</div>} />
        <Route path="reports" element={<div className="p-8 text-center text-muted-foreground">Aggregated Global Reports coming soon</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
