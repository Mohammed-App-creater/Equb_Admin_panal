import React from "react";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Toaster />
        <AppRoutes />
      </AuthProvider>   
    </HashRouter>
  );
};

export default App;
