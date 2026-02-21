import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            // The email is now derived from the JWT on the backend.
            const res = await API.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            setError('Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
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
                        <svg className="w-3.5 h-3.5 mr-1 text-yellow-500 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-12">

            {/* Premium Search Header */}
            <div className="relative overflow-hidden bg-white rounded-[2rem] p-10 md:p-14 shadow-xl text-center border border-surface-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100 to-purple-100 rounded-bl-full opacity-40 -z-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-brand-100 to-blue-100 rounded-tr-full opacity-40 -z-10 blur-2xl"></div>

                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner transform -rotate-3 border border-brand-100">
                    <svg className="w-8 h-8 text-brand-600 transform rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>

                <h1 className="text-4xl font-extrabold text-surface-900 mb-4 tracking-tight">Your Sessions Library</h1>
                <p className="text-surface-500 text-lg mx-auto font-medium">Access your upcoming mentoring sessions and review completed discussions.</p>
                {error && <p className="text-red-500 mt-6 font-semibold bg-red-50 py-2 px-4 rounded-lg inline-block">{error}</p>}
            </div>

            {/* Loading / Empty State */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                </div>
            ) : bookings.length === 0 && (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-surface-100 text-center relative overflow-hidden">
                    <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-surface-100">
                        <svg className="w-12 h-12 text-surface-300 transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-surface-900 mb-3">No Sessions Booked</h3>
                    <p className="text-surface-500 text-lg max-w-md mx-auto">You don't have any mentoring sessions booked yet. Browse our directory to find the perfect expert.</p>
                </div>
            )}

            {/* Bookings List */}
            {bookings.length > 0 && (
                <div className="relative">
                    {/* Subtle Timeline line */}
                    <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-surface-200 hidden md:block z-0"></div>

                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-surface-900 px-2 flex items-center">
                            Your Itinerary
                            <span className="ml-3 bg-brand-100 text-brand-700 text-sm py-1 px-3 rounded-full font-bold">{bookings.length} total</span>
                        </h2>
                    </div>

                    <div className="space-y-6 relative z-10">
                        {bookings.map((booking) => {
                            const dateObj = new Date(booking.date);
                            const isPast = booking.status === 'Completed' || dateObj < new Date(new Date().toDateString());

                            return (
                                <div key={booking._id} className={`bg-white rounded-[2rem] p-6 md:p-8 shadow-md border ${isPast ? 'border-surface-200 bg-surface-50/50' : 'border-surface-100 hover:border-brand-200'} hover:shadow-xl transition-all duration-300 relative group overflow-hidden`}>

                                    {/* Visual accent left */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${booking.status === 'Confirmed' ? 'bg-green-500' :
                                        booking.status === 'Pending' ? 'bg-yellow-400' : 'bg-surface-300'
                                        }`}></div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">

                                        {/* Date Block */}
                                        <div className="hidden md:flex flex-col items-center justify-center min-w-[100px] border-r border-surface-200 pr-6 mr-2">
                                            <span className={`text-sm font-bold uppercase tracking-wider ${isPast ? 'text-surface-400' : 'text-brand-600'}`}>
                                                {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                            <span className={`text-4xl font-extrabold tracking-tighter ${isPast ? 'text-surface-500' : 'text-surface-900'}`}>
                                                {dateObj.getDate()}
                                            </span>
                                            <span className="text-xs text-surface-400 font-semibold mt-1">
                                                {booking.timeSlot}
                                            </span>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center text-brand-700 font-bold shadow-inner">
                                                        {booking.expertId?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-xl font-extrabold ${isPast ? 'text-surface-700' : 'text-surface-900'}`}>
                                                            {booking.expertId?.name || 'Unknown Expert'}
                                                        </h3>
                                                        <p className="text-brand-600 text-sm font-semibold">{booking.expertId?.category}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    {getStatusBadge(booking.status)}
                                                </div>
                                            </div>

                                            {/* Mobile Date Block */}
                                            <div className="md:hidden mt-4 inline-flex items-center bg-surface-100 px-3 py-1.5 rounded-lg border border-surface-200 text-sm font-semibold text-surface-700">
                                                <svg className="w-4 h-4 mr-2 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.timeSlot}
                                            </div>

                                            {booking.notes && (
                                                <div className="mt-5 bg-surface-50 rounded-xl p-4 border border-surface-100 relative group-hover:bg-brand-50/50 transition-colors">
                                                    <svg className="absolute top-3 left-3 w-5 h-5 text-surface-300" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                                    <p className="pl-8 text-sm text-surface-600 font-medium italic">
                                                        {booking.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="hidden lg:flex flex-col justify-center items-end min-w-[140px] border-l border-surface-100 pl-6 h-full space-y-3">
                                            <button className="text-sm font-bold text-brand-600 hover:text-brand-800 transition flex items-center bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg w-full justify-center">
                                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Add to Cal
                                            </button>
                                            {!isPast && (
                                                <button className="text-sm font-bold text-surface-500 hover:text-red-600 transition flex items-center px-4 py-2 w-full justify-center">
                                                    Reschedule
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyBookings;
