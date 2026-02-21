import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';

function ExpertDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [expert, setExpert] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [formData, setFormData] = useState({ phone: '', notes: '' });

    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        fetchExpert();

        socket.on('slotBooked', (data) => {
            if (data.expertId === id) {
                setAvailableDates(prevDates => prevDates.map(d => {
                    if (d.date === data.date) {
                        return { ...d, slots: d.slots.filter(s => s !== data.timeSlot) };
                    }
                    return d;
                }));

                // Only show booking error if someone else booked it
                if (data.bookedByEmail !== user?.email) {
                    setSelectedSlot(prev => {
                        if (prev === data.timeSlot && selectedDate === data.date) {
                            setBookingError('The slot you selected was just booked by someone else. Please select another slot.');
                            return '';
                        }
                        return prev;
                    });
                }
            }
        });

        return () => socket.off('slotBooked');
    }, [id, selectedDate, user]);

    const fetchExpert = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/experts/${id}`);
            setExpert(res.data.expert);
            setAvailableDates(res.data.availableDates);
        } catch {
            setError('Failed to fetch expert details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitBooking = async (e) => {
        e.preventDefault();
        setBookingError('');
        setBookingSuccess(false);

        if (!selectedDate || !selectedSlot) return setBookingError('Please select a date and time slot.');
        if (!formData.phone) return setBookingError('Phone number is required.');

        try {
            setBookingLoading(true);
            await API.post('/bookings', { expertId: id, date: selectedDate, timeSlot: selectedSlot, ...formData });
            setBookingSuccess(true);
            setFormData({ phone: '', notes: '' });
            setSelectedSlot('');
            setSelectedDate('');
            fetchExpert();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setBookingError('This slot has just been booked by someone else. Please select another slot.');
                fetchExpert();
            } else {
                setBookingError(err.response?.data?.message || 'Failed to book session. Please try again.');
            }
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
    );
    if (error) return <div className="text-red-500 text-center py-12 font-semibold bg-red-50 rounded-2xl mx-auto max-w-lg mt-12">{error}</div>;
    if (!expert) return <div className="text-center py-12">Expert not found</div>;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative">
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center text-sm font-semibold text-surface-500 hover:text-surface-900 mb-8 transition-colors bg-white px-4 py-2 rounded-full w-max shadow-sm border border-surface-100"
            >
                <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Directory
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column: Expert Profile (Sticky) */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-28 bg-white rounded-[2rem] shadow-xl border border-surface-100 overflow-hidden transform hover:-translate-y-1 transition duration-500">
                        {/* Header Banner */}
                        <div className="h-32 bg-gradient-to-br from-brand-500 via-purple-500 to-indigo-600 relative">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <svg className="absolute top-0 right-0 text-white/10 w-32 h-32 transform translate-x-10 -translate-y-10" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>
                        </div>

                        <div className="px-8 pb-8 flex flex-col items-center -mt-16 text-center">
                            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl mb-4 relative z-10">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center text-5xl font-extrabold text-surface-400 uppercase tracking-tighter">
                                    {expert.name.charAt(0)}{expert.name.split(' ').length > 1 ? expert.name.split(' ')[1].charAt(0) : ''}
                                </div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>

                            <h1 className="text-3xl font-extrabold text-surface-900 mb-1">{expert.name}</h1>
                            <p className="text-brand-600 font-semibold mb-6 flex items-center bg-brand-50 px-3 py-1 rounded-full text-sm">
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                {expert.category}
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-surface-50 p-4 rounded-2xl border border-surface-100">
                                    <div className="flex justify-center text-yellow-500 mb-1">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </div>
                                    <div className="text-xl font-bold text-surface-900">{expert.rating}</div>
                                    <div className="text-xs text-surface-500 font-medium uppercase tracking-wider">Rating</div>
                                </div>
                                <div className="bg-surface-50 p-4 rounded-2xl border border-surface-100">
                                    <div className="flex justify-center text-brand-500 mb-1">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="text-xl font-bold text-surface-900">{expert.experience}</div>
                                    <div className="text-xs text-surface-500 font-medium uppercase tracking-wider">Years Exp</div>
                                </div>
                            </div>

                            <div className="mt-8 text-left w-full border-t border-surface-100 pt-6">
                                <h3 className="text-sm font-bold text-surface-900 mb-3 uppercase tracking-wider">About</h3>
                                <p className="text-sm text-surface-600 leading-relaxed font-medium">
                                    Book a high-impact 1-on-1 session with {expert.name} to get personalized mentorship, architectural review, and strategic guidance perfectly tailored to your goals in {expert.category}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Flow */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-surface-100 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-bl-full opacity-50 -z-10 pointer-events-none"></div>

                        <div className="mb-8 border-b border-surface-100 pb-6">
                            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">Schedule Session</h2>
                            <p className="text-surface-500 mt-2 font-medium">Find a time that works and confirm your details instantly.</p>
                        </div>

                        {/* Alerts */}
                        {bookingSuccess && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 p-6 rounded-2xl mb-8 flex items-start shadow-sm animate-fade-in">
                                <div className="flex-shrink-0 bg-green-500 text-white rounded-full p-1.5 mr-4 shadow-sm">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Booking Confirmed!</h3>
                                    <p className="text-green-700 font-medium text-sm">Your session is locked in. We've sent a calendar invitation and meeting link to your email.</p>
                                </div>
                            </div>
                        )}

                        {bookingError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl mb-8 flex items-center shadow-sm animate-fade-in">
                                <svg className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span className="font-semibold">{bookingError}</span>
                            </div>
                        )}

                        {/* Step 1: Time Selection */}
                        <div className="mb-12">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold mr-3 shadow-sm border border-brand-200">1</div>
                                <h3 className="text-xl font-bold text-surface-900">Select Date & Time</h3>
                            </div>

                            <div className="space-y-4">
                                {availableDates.length === 0 ? (
                                    <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8 text-center text-surface-500 font-medium">
                                        Fully booked! No available slots right now.
                                    </div>
                                ) : (
                                    availableDates.map((day) => {
                                        const dateObj = new Date(day.date);
                                        const isToday = new Date().toDateString() === dateObj.toDateString();

                                        return (
                                            <div key={day.date} className="bg-white border rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-brand-200">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-lg flex items-center text-surface-900">
                                                        {isToday ? <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded mr-2 font-bold uppercase tracking-wider">Today</span> : null}
                                                        {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                                    </h4>
                                                </div>

                                                {day.slots.length === 0 ? (
                                                    <p className="text-sm font-medium text-surface-400 bg-surface-50 p-3 rounded-xl border border-surface-100 inline-block">
                                                        Slots booked out
                                                    </p>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                        {day.slots.map(slot => {
                                                            const isSelected = selectedDate === day.date && selectedSlot === slot;
                                                            return (
                                                                <button
                                                                    key={slot}
                                                                    type="button"
                                                                    onClick={() => { setSelectedDate(day.date); setSelectedSlot(slot); setBookingError(''); }}
                                                                    className={`py-3 px-2 text-sm font-bold rounded-xl transition-all duration-200 border-2 ${isSelected
                                                                        ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30 transform scale-[1.03] ring-2 ring-brand-300 ring-offset-1'
                                                                        : 'bg-white text-surface-700 border-surface-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50'
                                                                        }`}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* Step 2: Form */}
                        <form onSubmit={submitBooking} className="relative">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold mr-3 shadow-sm border border-brand-200">2</div>
                                <h3 className="text-xl font-bold text-surface-900">Your Details</h3>
                            </div>

                            <div className="bg-surface-50/50 p-6 md:p-8 rounded-3xl border border-surface-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-sm font-bold text-surface-700 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            </div>
                                            <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all focus:shadow-md outline-none"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-sm font-bold text-surface-700 ml-1">Goals / Context <span className="text-surface-400 font-normal">(Optional)</span></label>
                                        <textarea name="notes" rows="3" value={formData.notes} onChange={handleInputChange}
                                            className="w-full px-4 py-3.5 bg-white border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all focus:shadow-md outline-none resize-none"
                                            placeholder="Share brief context about what you'd like to dive into..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className={`w-full group relative flex justify-center items-center py-4 px-8 border border-transparent rounded-2xl shadow-lg shadow-brand-500/30 text-lg font-extrabold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all transform hover:scale-[1.01] active:scale-[0.99] ${bookingLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {bookingLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Confirming...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Booking
                                            <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs font-semibold text-surface-400 mt-4 uppercase tracking-wider">Payments securely processed (Stub)</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpertDetail;
