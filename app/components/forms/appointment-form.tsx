'use client';

import React, { useState } from 'react';

function AppointmentForm() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const [appointmentDate, appointmentTime] = date.split('T');
            
            const payload = {
                title,
                description,
                date: appointmentDate,
                time: appointmentTime,
                priority: 'high',
                type: 'business',
                assigned: email,
                patients: [fullname],
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/appointments/business`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccess('Message sent successfully');
                setFullname('');
                setEmail('');
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
                Make Your Appointment
            </h3>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Fullname</label>
                        <input
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="John Doe"
                            type="text"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            id="fullname"
                            name="fullname"
                            required
                        />
                    </div>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">E-mail</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john.doe@example.org"
                            type="email"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            required
                        />
                    </div>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Date & Time</label>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="Select Date & Time"
                            type="datetime-local"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            id="date"
                            name="date"
                            required
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Subject</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Subject"
                            type="text"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            id="subject"
                            name="subject"
                            required
                        />
                    </div>
                    <div className="mb-1 sm:mb-2">
                        <label className="inline-block mb-1 font-normal">Message</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write a Message..."
                            className="flex-grow w-full h-14 px-4 py-3 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                            required
                        ></textarea>
                    </div>
                    <div className="mt-4 mb-2 sm:mb-4">
                        <button
                            type="submit"
                            className="relative cursor-pointer inline-flex items-center justify-center w-full h-12 px-6 font-normal tracking-wide text-white transition duration-200 rounded bg-indigo-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Send Now'}
                        </button>
                    </div>

                    {error && <p className="text-xs text-red-500 sm:text-sm font-normal">{error}</p>}
                    {success && <p className="text-xs text-green-500 sm:text-sm font-normal">{success}</p>}

                    <p className="text-xs text-gray-600 sm:text-sm font-normal">
                        We respect your privacy. <span className="text-green-600"></span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default AppointmentForm;