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
        <div className="relative bg-white rounded-xl shadow-2xl p-7 sm:p-10 text-slate-700 w-full md:max-w-2xl mx-auto">
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
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setPhone(value);
                            }}
                            placeholder="07XXXXXXXX"
                            type="text"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                            maxLength={10}
                            pattern="^(078|072|073|079)\d{7}$"
                            title="Phone must start with 078, 072, 073, or 079 and be 10 digits"
                        />
                    </div>

                    {/* Type */}
                    <div className="mb-1 sm:mb-2 max-w-1/2 min-w-1/2">
                        <label className="inline-block mb-1 font-normal">Type / Services</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="" disabled>Select Type / Service</option>
                            <option value="CONSULTATION">Consultation</option>
                            <option value="DIABETES_COUNSELLING">Nutrition counselling for Diabetes (Type 1 & Type 2)</option>
                            <option value="HYPERTENSION_COUNSELLING">Nutrition counselling for Hypertension (High Blood Pressure)</option>
                            <option value="CARDIOVASCULAR_COUNSELLING">Nutrition counselling for Cardiovascular Disease</option>
                            <option value="WEIGHT_MANAGEMENT">Weight Management Programs (Weight Loss & Weight Gain)</option>
                            <option value="MEAL_PLANS">Personalized Meal Plans</option>
                            <option value="WELLNESS_PROGRAMS">Workplace & Institutional Wellness Programs</option>
                            <option value="LIFESTYLE_COACHING">Lifestyle Coaching & Education</option>
                            <option value="MATERNAL_CHILD_NUTRITION">Maternal & Child Nutrition</option>
                            <option value="SPECIAL_POPULATIONS">Nutrition for Special Populations</option>
                            <option value="SUPPLEMENT_GUIDANCE">Dietary Supplement Guidance</option>
                            <option value="BUSINESS">Business</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="GENERAL">General</option>
                            <option value="FOLLOW_UP">Follow up</option>
                            <option value="EMERGENCY">Emergency</option>
                            <option value="CHECKUP">Checkup</option>
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
                            onChange={(e) => {
                                setAppointmentDate(e.target.value);
                                setAppointmentTime(''); // Reset time when date changes
                            }}
                            type="date"
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Appointment Time */}
                    <div className="mb-1 sm:mb-2 max-w-1/2 min-w-1/2">
                        <label className="inline-block mb-1 font-normal">Appointment Time</label>
                        <select
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            className="flex-grow w-full h-12 px-4 mb-2 font-normal transition duration-200 bg-white border border-gray-300 rounded appearance-none focus:border-indigo-400 focus:outline-none focus:shadow-outline"
                            required
                            disabled={!appointmentDate}
                        >
                            <option value="" disabled>Select Time</option>
                            {(() => {
                                const startHour = 8;
                                const endHour = 20;
                                const now = new Date();
                                let minTime = `${String(startHour).padStart(2, '0')}:00`;

                                if (
                                    appointmentDate &&
                                    appointmentDate === now.toISOString().split('T')[0]
                                ) {
                                    // If today, set minTime to next available half hour
                                    const currentMinutes = now.getMinutes();
                                    let nextHour = now.getHours();
                                    let nextMinutes = 0;
                                    if (currentMinutes < 30) {
                                        nextMinutes = 30;
                                    } else {
                                        nextHour += 1;
                                        nextMinutes = 0;
                                    }
                                    // Clamp to working hours
                                    if (nextHour < startHour) nextHour = startHour;
                                    if (nextHour > endHour) nextHour = endHour;
                                    minTime = `${String(nextHour).padStart(2, '0')}:${nextMinutes === 0 ? '00' : '30'}`;
                                }

                                const slots: string[] = [];
                                for (let hour = startHour; hour <= endHour; hour++) {
                                    for (const min of [0, 30]) {
                                        const value = `${String(hour).padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
                                        if (value >= minTime) {
                                            slots.push(value);
                                        }
                                    }
                                }
                                return slots.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ));
                            })()}
                        </select>
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