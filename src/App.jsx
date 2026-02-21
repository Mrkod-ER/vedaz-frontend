import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import ExpertsList from './pages/ExpertsList';
import ExpertDetail from './pages/ExpertDetail';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive
        ? 'text-brand-600 bg-brand-50 shadow-sm'
        : 'text-surface-600 hover:text-brand-600 hover:bg-surface-50'
        }`}
    >
      {children}
    </Link>
  );
}

function Navigation() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <header className="sticky top-0 z-50 glass border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform rotate-3">
              <svg className="w-6 h-6 text-white transform -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-surface-900 ml-2">
              Expert<span className="text-gradient">Book</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2 bg-white/50 p-1.5 rounded-full border border-surface-200 shadow-inner">
            <NavLink to="/">Find Experts</NavLink>
            <NavLink to="/my-bookings">My Sessions</NavLink>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-white border border-surface-200 hover:border-brand-300 rounded-full pl-1.5 pr-4 py-1.5 shadow-sm transition-all hover:shadow-md group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-purple-600 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-inner flex-shrink-0">
                    {initials}
                  </div>
                  <span className="hidden md:block text-sm font-bold text-surface-700 group-hover:text-brand-700 transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-surface-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-surface-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-surface-100">
                      <p className="font-extrabold text-surface-900 text-sm">{user.name}</p>
                      <p className="text-surface-400 text-xs mt-0.5 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-brand-600 font-semibold transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      My Sessions
                    </Link>
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden md:block text-surface-700 hover:text-brand-600 text-sm font-bold transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </>
            )}

            <button className="md:hidden p-2 text-surface-600 ml-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
          <Navigation />

          <main className="flex-grow w-full py-8 text-surface-800">
            <Routes>
              <Route path="/" element={<ExpertsList />} />
              <Route path="/experts/:id" element={<ProtectedRoute><ExpertDetail /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>

          <footer className="footer bg-white border-t border-surface-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-surface-500 text-sm">
              <p className="font-medium">&copy; 2026 ExpertBook Platform. All rights reserved.</p>
              <p className="mt-2 text-surface-400">Secure, Real-Time Sessions.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
