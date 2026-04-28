import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }/>
      <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
      <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
      <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            }
          />
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default App;
