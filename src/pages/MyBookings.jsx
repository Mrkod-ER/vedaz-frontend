import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await API.get('/bookings');
            setBookings(res.data);
        } catch {
            setError('Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            setCancellingId(bookingId);
            await API.delete(`/bookings/${bookingId}`);
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed':
                return (
                    <span className="flex items-center bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                        Confirmed
                    </span>
                );
            case 'Completed':
                return (
                    <span className="flex items-center bg-surface-100 text-surface-600 text-xs font-bold px-3 py-1.5 rounded-full border border-surface-200 shadow-sm">
                        <svg className="w-3.5 h-3.5 mr-1 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Completed
                    </span>
                );
            default:
                return (
                    <span className="flex items-center bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm">
                        <svg className="w-3.5 h-3.5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Pending
                    </span>
                );
        }
    };

    const tabs = ['All', 'Pending', 'Confirmed', 'Completed'];
    const filteredBookings = activeTab === 'All' ? bookings : bookings.filter(b => b.status === activeTab);

    const tabCounts = {
        All: bookings.length,
        Pending: bookings.filter(b => b.status === 'Pending').length,
        Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
        Completed: bookings.filter(b => b.status === 'Completed').length,
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">

            {/* Header */}
            <div className="relative overflow-hidden bg-white rounded-[2rem] p-10 md:p-14 shadow-xl text-center border border-surface-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100 to-purple-100 rounded-bl-full opacity-40 -z-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-brand-100 to-blue-100 rounded-tr-full opacity-40 -z-10 blur-2xl"></div>

                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner transform -rotate-3 border border-brand-100">
                    <svg className="w-8 h-8 text-brand-600 transform rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>

                <h1 className="text-4xl font-extrabold text-surface-900 mb-3 tracking-tight">Your Sessions</h1>
                <p className="text-surface-500 text-lg font-medium">Manage your upcoming and past mentoring sessions.</p>

                {/* Stats Row */}
                {!loading && bookings.length > 0 && (
                    <div className="flex justify-center gap-6 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-surface-900">{tabCounts.All}</div>
                            <div className="text-xs text-surface-400 font-semibold uppercase tracking-wider">Total</div>
                        </div>
                        <div className="w-px bg-surface-100"></div>
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-yellow-600">{tabCounts.Pending}</div>
                            <div className="text-xs text-surface-400 font-semibold uppercase tracking-wider">Pending</div>
                        </div>
                        <div className="w-px bg-surface-100"></div>
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-green-600">{tabCounts.Confirmed}</div>
                            <div className="text-xs text-surface-400 font-semibold uppercase tracking-wider">Confirmed</div>
                        </div>
                        <div className="w-px bg-surface-100"></div>
                        <div className="text-center">
                            <div className="text-3xl font-extrabold text-surface-500">{tabCounts.Completed}</div>
                            <div className="text-xs text-surface-400 font-semibold uppercase tracking-wider">Completed</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Filter Tabs */}
            {!loading && bookings.length > 0 && (
                <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-surface-100">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab
                                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                                : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                                }`}
                        >
                            {tab}
                            {tabCounts[tab] > 0 && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-white/30 text-white' : 'bg-surface-100 text-surface-500'}`}>
                                    {tabCounts[tab]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="text-surface-400 font-medium">Loading your sessions...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center shadow-sm">
                    <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && bookings.length === 0 && (
                <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-surface-100">
                    <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 mb-2">No sessions yet</h3>
                    <p className="text-surface-400 font-medium mb-6">Book your first expert session to get started.</p>
                    <a href="/" className="inline-flex items-center bg-brand-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-500 transition-colors shadow-md shadow-brand-500/30">
                        Browse Experts
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                </div>
            )}

            {/* No results for active tab */}
            {!loading && !error && bookings.length > 0 && filteredBookings.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center border border-surface-100">
                    <p className="text-surface-400 font-medium">No {activeTab.toLowerCase()} sessions found.</p>
                </div>
            )}

            {/* Bookings List */}
            {!loading && !error && filteredBookings.length > 0 && (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                        const dateObj = new Date(booking.date);
                        const isPast = booking.status === 'Completed' || dateObj < new Date(new Date().toDateString());
                        const expertName = booking.expertId?.name || 'Expert';
                        const initials = expertName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

                        return (
                            <div
                                key={booking._id}
                                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${isPast ? 'border-surface-100 opacity-80' : 'border-surface-100 hover:border-brand-200'}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Expert Avatar */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-md">
                                        {initials}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div>
                                                <h3 className="font-extrabold text-surface-900 text-lg leading-tight">{expertName}</h3>
                                                <p className="text-brand-600 text-sm font-semibold">{booking.expertId?.category}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(booking.status)}
                                                {booking.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleCancel(booking._id)}
                                                        disabled={cancellingId === booking._id}
                                                        className="flex items-center text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                                                    >
                                                        {cancellingId === booking._id ? (
                                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                                        ) : (
                                                            <>
                                                                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                Cancel
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-3">
                                            <div className="flex items-center text-sm text-surface-500 font-medium">
                                                <svg className="w-4 h-4 mr-1.5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center text-sm text-surface-500 font-medium">
                                                <svg className="w-4 h-4 mr-1.5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {booking.timeSlot}
                                            </div>
                                            {booking.phone && (
                                                <div className="flex items-center text-sm text-surface-500 font-medium">
                                                    <svg className="w-4 h-4 mr-1.5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                    {booking.phone}
                                                </div>
                                            )}
                                        </div>

                                        {booking.notes && (
                                            <p className="mt-3 text-sm text-surface-500 bg-surface-50 rounded-xl px-4 py-2 border border-surface-100 italic">
                                                "{booking.notes}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyBookings;
