import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Shelters from './pages/Shelters'; 
import Adopters from './pages/Adopters';
import Pets from './pages/Pets';
import Donations from './pages/Donations';
import Applications from './pages/Applications';
import HealthLogs from './pages/HealthLogs';

function App() {
  // Check if admin is already logged in
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  const AdminLayout = ({ children }) => (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#fff', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );

  return (
    <Routes>
      {/* 2. LOGIN ROUTE 
          If already logged in, redirect to dashboard automatically */}
      <Route 
        path="/login" 
        element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} 
      />

      {/* 3. PROTECTED DASHBOARD ROUTE 
          Only accessible if token exists. Includes Sidebar + Dashboard layout */}
     <Route 
        path="/dashboard" 
        element={token ? <AdminLayout><Dashboard /></AdminLayout> : <Navigate to="/login" />} 
      />

      {/* Shelters Management */}
      <Route 
        path="/users/shelters" 
        element={token ? <AdminLayout><Shelters /></AdminLayout> : <Navigate to="/login" />} 
      />

      {/* Adopters Management */}
      <Route 
        path="/users/adopters" 
        element={token ? <AdminLayout><Adopters /></AdminLayout> : <Navigate to="/login" />} 
      />

      {/* Pets Management */}
      <Route 
        path="/pets" 
        element={token ? <AdminLayout><Pets /></AdminLayout> : <Navigate to="/login" />} 
      />

      {/* Applications Management */}
      <Route 
        path="/applications" 
        element={token ? <AdminLayout><Applications /></AdminLayout> : <Navigate to="/login" />} 
      />

      {/* Health Logs Management */}
      <Route 
        path="/health" 
        element={token ? <AdminLayout><HealthLogs /></AdminLayout> : <Navigate to="/login" />} 
      />

      {/* Donations Management */}
      <Route 
        path="/donations" 
        element={token ? <AdminLayout><Donations /></AdminLayout> : <Navigate to="/login" />}
      /> 

      {/* CATCH-ALL ROUTE */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );

}

export default App;