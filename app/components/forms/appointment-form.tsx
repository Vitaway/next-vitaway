'use client';

import React, { useState } from 'react';

function AppointmentForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                name,
                email,
                phone,
                subject,
                reasons: 'Appointment',
                message,
                type,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/appointments/business`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccess('Appointment booked successfully');
                setName('');
                setEmail('');
                setPhone('');
                setSubject('');
                setMessage('');
                setType('');
                setAppointmentDate('');
                setAppointmentTime('');
            } else {
                const data = await response.json();
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative bg-white rounded-xl shadow-2xl p-7 sm:p-10 text-slate-700 w-full">
            <h3 className="mb-4 text-xl font-normal sm:text-center sm:mb-6 sm:text-2xl">
                Book Your Appointment
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-2">
                    {/* Name */}
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            type="text"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                            maxLength={255}
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">E-mail</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john.doe@example.org"
                            type="email"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            maxLength={255}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Phone */}
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Phone</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1234567890"
                            type="text"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                            maxLength={20}
                        />
                    </div>

                    {/* Type */}
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Type / Services</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="" disabled>Select Type / Service</option>
                            <option value="BUSINESS">Business</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="GENERAL">General</option>
                            <option value="FOLLOW_UP">Follow up</option>
                            <option value="EMERGENCY">Emergency</option>
                            <option value="CHECKUP">Checkup</option>
                            <option value="CONSULTATION">Consultation</option>
                        </select>
                    </div>
                </div>

                {/* Subject */}
                <div className="mb-1 sm:mb-2">
                    <label className="inline-block mb-1 font-normal">Subject</label>
                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        type="text"
                        className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                        required
                        maxLength={255}
                    />
                </div>

                {/* Message */}
                <div className="mb-1 sm:mb-2">
                    <label className="inline-block mb-1 font-normal">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-grow w-full h-14 px-4 py-3 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                        required
                        maxLength={1000}
                    ></textarea>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Appointment Date */}
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Appointment Date</label>
                        <input
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            type="date"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Appointment Time */}
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Appointment Time</label>
                        <input
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            type="time"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-4 mb-2 sm:mb-4">
                    <button
                        type="submit"
                        className="relative cursor-pointer inline-flex items-center justify-center w-full h-12 px-6 font-normal tracking-wide text-white transition duration-200 rounded bg-indigo-400 hover:bg-indigo-500 focus:shadow-outline focus:outline-none"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Book Appointment'}
                    </button>
                </div>

                {/* Error and Success Messages */}
                {error && <p className="text-xs text-red-500 sm:text-sm font-normal">{error}</p>}
                {success && <p className="text-xs text-green-500 sm:text-sm font-normal">{success}</p>}
            </form>
        </div>
    );
}

export default AppointmentForm;