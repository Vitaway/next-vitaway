'use client';

import React, { useEffect, useState } from 'react';
import DatePicker from '@/app/components/inputs/DatePicker';
import { fetchDayAvailability } from '@/lib/api/services/appointment-availability';
import { buildTimeSlots, earliestBookableDate } from '@/lib/appointment-slots';

type Props = {
    date: string;
    time: string;
    error?: string;
    onChange: (next: { date?: string; time?: string }) => void;
};

function StepSlot({ date, time, error, onChange }: Props) {
    const [freeTimes, setFreeTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const slots = date && !loading ? buildTimeSlots(date, freeTimes) : [];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    useEffect(() => {
        if (!date) {
            setFreeTimes([]);
            return;
        }
        let stop = false;
        setLoading(true);
        setLoadError('');
        fetchDayAvailability(date)
            .then((times) => {
                if (!stop) setFreeTimes(times);
            })
            .catch(() => {
                if (!stop) {
                    setFreeTimes([]);
                    setLoadError('Those times could not be loaded.');
                }
            })
            .finally(() => {
                if (!stop) setLoading(false);
            });
        return () => {
            stop = true;
        };
    }, [date]);

    return (
        <div>
            <h2 className="text-xl font-bold text-[#003E48]">
                Pick an open <span className="font-accent">time</span>
            </h2>
            <div className="mt-5">
                <DatePicker
                    label="Day"
                    required
                    value={date}
                    minDate={earliestBookableDate()}
                    maxDate={maxDate}
                    defaultViewYearsAgo={0}
                    onChange={(next) => onChange({ date: next, time: '' })}
                />
            </div>
            {loading ? <p className="mt-4 text-sm text-[#003E48]/60">Loading open times…</p> : null}
            {loadError ? <p className="mt-4 text-sm text-red-600">{loadError}</p> : null}
            {date && !loading && !loadError && slots.length === 0 ? (
                <p className="mt-4 text-sm text-[#003E48]/70">No open times that day.</p>
            ) : null}
            {slots.length > 0 ? (
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {slots.map((slot) => {
                        const selected = time === slot;
                        return (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => onChange({ time: slot })}
                                className={`rounded-2xl border px-2 py-3 text-sm font-semibold ${
                                    selected
                                        ? 'border-[#E85A2E] bg-[#FFF4F0] text-[#E85A2E]'
                                        : 'border-transparent bg-white text-[#003E48]'
                                }`}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>
            ) : null}
            {error ? <p className="mt-3 text-sm font-medium text-red-500">{error}</p> : null}
        </div>
    );
}

export default StepSlot;
