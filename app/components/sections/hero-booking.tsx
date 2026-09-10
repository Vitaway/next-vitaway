'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import DatePicker from '../inputs/DatePicker';
import { useBooking } from '../booking/booking-context';
import { buildTimeSlots, earliestBookableDate, isSlotBookable } from '@/lib/appointment-slots';

const STORAGE_KEY = 'vitaway-booking-bar-hidden';
const SCROLL_HIDE_AT = 280;
const SCROLL_SHOW_AT = 100;

const fieldClass =
    'mt-1 h-10 w-full appearance-none rounded-lg border-0 bg-white px-3 pr-8 text-sm text-[#003E48] shadow-sm outline-none ring-1 ring-[#003E48]/10 transition focus:ring-[#003E48]/30';

function Chevron() {
    return (
        <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#003E48]/40"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
        >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function BookingForm({ onClose }: { onClose: () => void }) {
    const { openBooking } = useBooking();
    const [tab, setTab] = useState<'clinic' | 'call'>('clinic');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const minDate = useMemo(() => earliestBookableDate(), []);
    const maxDate = useMemo(() => {
        const d = startOfToday();
        d.setFullYear(d.getFullYear() + 1);
        return d;
    }, []);

    const timeSlots = useMemo(() => buildTimeSlots(date), [date]);

    useEffect(() => {
        if (time && !timeSlots.includes(time)) setTime('');
    }, [time, timeSlots]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time || !isSlotBookable(date, time)) return;
        openBooking({ mode: tab, date, time });
    };

    return (
        <div className="relative w-full">
            <div className="flex items-end">
                <button
                    type="button"
                    onClick={() => setTab('clinic')}
                    className={`flex items-center gap-2 rounded-t-xl px-4 py-2 text-[13px] font-semibold transition ${
                        tab === 'clinic' ? 'bg-[#E8F7F4] text-[#003E48]' : 'bg-white text-[#003E48]/45'
                    }`}
                >
                    {tab === 'clinic' ? <span className="h-1.5 w-1.5 rounded-full bg-[#E85A2E]" /> : null}
                    Book appointment
                </button>
                <button
                    type="button"
                    onClick={() => setTab('call')}
                    className={`flex items-center gap-2 rounded-t-xl px-4 py-2 text-[13px] font-semibold transition ${
                        tab === 'call' ? 'bg-[#E8F7F4] text-[#003E48]' : 'bg-white text-[#003E48]/45'
                    }`}
                >
                    {tab === 'call' ? <span className="h-1.5 w-1.5 rounded-full bg-[#E85A2E]" /> : null}
                    On a call
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close booking form"
                    className="ml-auto mb-1 mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#003E48]/55 shadow-sm transition hover:bg-[#E8F7F4] hover:text-[#003E48]"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <form
                onSubmit={onSubmit}
                className="grid gap-3 rounded-tr-xl rounded-b-none bg-[#E8F7F4] px-3 py-3 shadow-[0_16px_40px_rgba(0,62,72,0.16)] sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-3 sm:px-4 sm:py-3.5"
            >
                <DatePicker
                    label="Day"
                    value={date}
                    onChange={(next) => {
                        setDate(next);
                        setTime('');
                    }}
                    placeholder="Select"
                    minDate={minDate}
                    maxDate={maxDate}
                    defaultViewYearsAgo={0}
                    compact
                    placement="top"
                    className="mt-0 min-w-0"
                />

                <label className="block min-w-0">
                    <span className="text-[11px] font-semibold text-[#003E48]">Time</span>
                    <div className="relative">
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={fieldClass}
                            disabled={!date}
                        >
                            <option value="">{date ? 'Select' : 'Pick a day'}</option>
                            {timeSlots.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <Chevron />
                    </div>
                </label>

                <button
                    type="submit"
                    disabled={!date || !time || !isSlotBookable(date, time)}
                    className="press-btn press-btn--sm h-10 shrink-0 !rounded-lg sm:min-w-[148px]"
                >
                    Book appointment
                </button>
            </form>
        </div>
    );
}

function startOfToday() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function StickyBooking() {
    const pathname = usePathname();
    const { isOpen: modalOpen } = useBooking();
    const [manualClosed, setManualClosed] = useState(false);
    const [scrollCollapsed, setScrollCollapsed] = useState(false);
    const [forceOpen, setForceOpen] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            setManualClosed(sessionStorage.getItem(STORAGE_KEY) === '1');
        } catch {
            setManualClosed(false);
        }
        setReady(true);
    }, []);

    useEffect(() => {
        if (manualClosed) return;

        let frame = 0;
        const update = () => {
            frame = 0;
            const y = window.scrollY || document.documentElement.scrollTop || 0;

            if (forceOpen) {
                if (y <= SCROLL_SHOW_AT) setForceOpen(false);
                return;
            }

            setScrollCollapsed((prev) => {
                if (y >= SCROLL_HIDE_AT) return true;
                if (y <= SCROLL_SHOW_AT) return false;
                return prev;
            });
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [manualClosed, forceOpen]);

    const close = () => {
        setManualClosed(true);
        setScrollCollapsed(false);
        setForceOpen(false);
        try {
            sessionStorage.setItem(STORAGE_KEY, '1');
        } catch {
            /* ignore */
        }
    };

    const reopen = () => {
        setManualClosed(false);
        setScrollCollapsed(false);
        setForceOpen(true);
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
    };

    if (!ready || pathname?.startsWith('/appointments') || modalOpen) return null;

    const showForm = !manualClosed && (!scrollCollapsed || forceOpen);
    const showTab = !showForm;

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[75]">
            <div className="pointer-events-auto mx-auto w-full max-w-[720px]">
                <div
                    className={`origin-bottom transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        showForm
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-[110%] opacity-0'
                    }`}
                    aria-hidden={!showForm}
                >
                    <BookingForm onClose={close} />
                </div>

                <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        showTab
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-8 opacity-0'
                    }`}
                    aria-hidden={!showTab}
                >
                    <button
                        type="button"
                        onClick={reopen}
                        className="flex items-center gap-2 rounded-t-xl bg-[#E8F7F4] px-4 py-2 text-[13px] font-semibold text-[#003E48] shadow-[0_-8px_24px_rgba(0,62,72,0.12)]"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E85A2E]" />
                        Book appointment
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                            <path
                                d="M6 14l6-6 6 6"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StickyBooking;
