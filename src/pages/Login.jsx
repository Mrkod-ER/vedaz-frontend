import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center animate-fade-in relative z-10 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-surface-100 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-bl-full opacity-60 -z-10 blur-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-50 rounded-tr-full opacity-60 -z-10 blur-xl pointer-events-none"></div>

                <div className="w-16 h-16 bg-gradient-to-br from-brand-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30 transform -rotate-3">
                    <svg className="w-8 h-8 text-white transform rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>

                <h2 className="text-3xl font-extrabold text-center text-surface-900 mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-center text-surface-500 mb-8 font-medium">Continue your mentorship journey.</p>

                {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100 flex items-center shadow-sm">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {error}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-surface-700 ml-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all focus:bg-white outline-none font-medium text-surface-900"
                                placeholder="you@email.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-surface-700 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all focus:bg-white outline-none font-medium text-surface-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full group mt-8 relative flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-lg shadow-brand-500/30 text-lg font-extrabold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <svg className="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-surface-600">
                    Don't have an account? <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
