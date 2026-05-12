import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import GrievanceForm from './components/GrievanceForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';

export const MOCK_USERS = [
  { email: 'aditya@gmail.com', password: 'citizen123', ward_number: 160 },
  { email: 'test@sys.gov', password: 'test456', ward_number: 42 }
];

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mockUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mockUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockUser');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user && user.role === 'admin';

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-gray-200 selection:bg-maroon-500 selection:text-white">
        {isAuthenticated && (
          <nav className="border-b border-white/10 glass-panel sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <h1 className="font-mono font-bold text-xl tracking-wider text-white">SYS.GOV.<span className="text-maroon-500">AI</span></h1>
              <div className="space-x-8 flex items-center font-mono text-sm tracking-wide">
                <Link to="/" className="text-gray-500 hover:text-white transition-colors duration-300">REPORT</Link>
                {isAdmin && (
                  <Link to="/admin-dashboard" className="text-gray-500 hover:text-white transition-colors duration-300">ADMIN_TERM</Link>
                )}
                <button onClick={handleLogout} className="text-gray-500 hover:text-maroon-500 transition-colors duration-300">LOGOUT</button>
              </div>
            </div>
          </nav>
        )}

        <main className={`container mx-auto px-4 md:px-8 max-w-6xl ${isAuthenticated ? 'py-12' : ''}`}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setUser={setUser} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
            
            <Route path="/" element={isAuthenticated ? <GrievanceForm user={user} /> : <Navigate to="/login" />} />
            
            <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;