import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
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

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:inline text-sm font-semibold text-surface-600">
                  Welcome, <span className="text-brand-700">{user.name.split(' ')[0]}</span>!
                </span>
                <button
                  onClick={logout}
                  className="bg-surface-100 hover:bg-red-50 text-surface-700 hover:text-red-600 px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-surface-200 shadow-sm"
                >
                  Sign Out
                </button>
              </>
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
