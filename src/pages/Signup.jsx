import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center animate-fade-in relative z-10 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-surface-100 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-bl-full opacity-60 -z-10 blur-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-50 rounded-tr-full opacity-60 -z-10 blur-xl pointer-events-none"></div>

                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30 transform -rotate-3">
                    <svg className="w-8 h-8 text-white transform rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                </div>

                <h2 className="text-3xl font-extrabold text-center text-surface-900 mb-2 tracking-tight">Create Account</h2>
                <p className="text-center text-surface-500 mb-8 font-medium">Join ExpertBook and accelerate your growth.</p>

                {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100 flex items-center shadow-sm">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {error}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-surface-700 ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-3.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all focus:bg-white outline-none font-medium text-surface-900"
                            placeholder="Jane Doe"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-surface-700 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all focus:bg-white outline-none font-medium text-surface-900"
                            placeholder="you@email.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-surface-700 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 pr-12 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all focus:bg-white outline-none font-medium text-surface-900"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-400 hover:text-surface-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-surface-400 ml-1 mt-1">Minimum 6 characters</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full group mt-6 relative flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-lg shadow-purple-500/30 text-lg font-extrabold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <svg className="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-surface-600">
                    Already have an account? <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
