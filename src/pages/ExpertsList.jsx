import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function ExpertsList() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchExperts = async () => {
        try {
            setLoading(true);
            const res = await API.get('/experts', {
                params: { search, category, page, limit: 10 }
            });
            setExperts(res.data.experts);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError('Failed to fetch experts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperts();
    }, [page, category]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchExperts();
    };

    const categories = ['', 'Software Engineering', 'Product Management', 'Data Science', 'UX Design'];

    return (
        <div className="animate-fade-in pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-900 text-white p-8 md:p-16 mb-12 shadow-2xl flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/30 to-purple-600/30 opacity-50 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-brand-200 text-sm font-semibold tracking-wide mb-6 uppercase backdrop-blur-md">
                        World-Class Mentorship
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Accelerate your growth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-300">industry leaders</span>
                    </h1>
                    <p className="text-lg md:text-xl text-surface-300 mb-10 max-w-2xl mx-auto font-light">
                        Book 1-on-1 sessions instantly. No back-and-forth. Just deep insights from exactly who you need to speak with.
                    </p>

                    <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-md shadow-2xl transition hover:bg-white/15 focus-within:bg-white/20 focus-within:border-white/40">
                        <div className="pl-4 text-surface-300 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search experts by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-none text-white placeholder-surface-300 px-4 py-3 focus:outline-none focus:ring-0 text-lg"
                        />
                        <button type="submit" className="flex-shrink-0 bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <h2 className="text-2xl font-bold text-surface-900 tracking-tight">Our Top Mentors</h2>

                    {/* Category Filter Pills */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto hidescrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setCategory(cat); setPage(1); }}
                                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-sm ${category === cat
                                        ? 'bg-surface-900 text-white shadow-md transform scale-105'
                                        : 'bg-white text-surface-600 border border-surface-200 hover:border-surface-300 hover:bg-surface-50 hover:text-surface-900'
                                    }`}
                            >
                                {cat || 'All Categories'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                        <p className="text-surface-500 font-medium animate-pulse">Loading amazing experts...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50/80 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center shadow-sm">
                        <svg className="w-6 h-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-semibold">{error}</span>
                    </div>
                ) : experts.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] border border-surface-100 shadow-sm">
                        <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-surface-800 mb-2">No experts found</h3>
                        <p className="text-surface-500 max-w-md mx-auto">We couldn't find any experts matching your search criteria. Try a different term or category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                        {experts.map((expert, idx) => (
                            <Link
                                to={`/experts/${expert._id}`}
                                key={expert._id}
                                className={`group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-surface-100 hover:border-brand-200 p-6 transition-all duration-300 transform hover:-translate-y-1 block stagger-${min(4, idx % 4 + 1)} animate-fade-in relative overflow-hidden`}
                            >
                                {/* Decorative top gradient line */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center text-brand-700 font-bold text-xl shadow-inner uppercase">
                                        {expert.name.charAt(0)}{expert.name.split(' ').length > 1 ? expert.name.split(' ')[1].charAt(0) : ''}
                                    </div>
                                    <div className="flex items-center space-x-1 border border-yellow-200 bg-yellow-50/80 px-2.5 py-1 rounded-full shadow-sm">
                                        <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span className="text-sm font-bold text-yellow-700">{expert.rating}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-surface-900 mb-1 group-hover:text-brand-600 transition-colors">{expert.name}</h3>
                                <p className="text-sm text-brand-600 font-semibold mb-3">{expert.category}</p>

                                <div className="flex items-center text-surface-500 text-sm mb-6 border-t border-surface-50 pt-4">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <span className="font-medium text-surface-700 mr-1">{expert.experience}</span> years experience
                                </div>

                                <div className="w-full text-center bg-surface-50 text-surface-700 group-hover:bg-brand-50 group-hover:text-brand-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center">
                                    View Schedule
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-12 bg-white p-3 rounded-full shadow-sm border border-surface-100 w-max mx-auto">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-full border border-surface-200 text-surface-600 hover:bg-surface-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="px-4 text-surface-700 font-semibold text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-full border border-surface-200 text-surface-600 hover:bg-surface-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>
            {/* Utility CSS injected for dynamic staggering in map */}
            <style>{`
                .stagger-1 { animation-delay: 50ms; }
                .stagger-2 { animation-delay: 100ms; }
                .stagger-3 { animation-delay: 150ms; }
                .stagger-4 { animation-delay: 200ms; }
                .hidescrollbar::-webkit-scrollbar { display: none; }
                .hidescrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

// Utility for calculating stagger mapping
function min(a, b) { return a < b ? a : b; }

export default ExpertsList;
