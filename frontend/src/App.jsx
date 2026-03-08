import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripPlanner from './pages/TripPlanner';
import Landing from './pages/Landing';

function App() {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/60">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link to="/" className="text-lg font-semibold tracking-tight text-neutral-900 pointer-events-auto">ChalteFir.</Link>
            {user && (
              <button
                onClick={() => { localStorage.removeItem('userInfo'); window.location.href = '/login'; }}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/trip/:id" element={user ? <TripPlanner /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
