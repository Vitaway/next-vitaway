'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FormLabel from './FormLabel';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface DatePickerProps {
    label?: string;
    required?: boolean;
    value: string;
    errorMessage?: string;
    onChange: (value: string) => void;
    children?: React.ReactNode;
    placeholder?: string;
    /** Earliest selectable date. Defaults to 120 years before today. */
    minDate?: Date;
    /** Latest selectable date. Defaults to today. */
    maxDate?: Date;
    /** When empty, calendar opens at today minus this many years. */
    defaultViewYearsAgo?: number;
    className?: string;
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function toIsoDate(year: number, month: number, day: number): string {
    return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function parseIsoDate(value: string): Date | null {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }
    return date;
}

function formatDisplayDate(value: string): string {
    const date = parseIsoDate(value);
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isBeforeDay(a: Date, b: Date): boolean {
    return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfterDay(a: Date, b: Date): boolean {
    return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function clampViewDate(date: Date, min: Date, max: Date): Date {
    const monthStart = startOfMonth(date);
    const minMonth = startOfMonth(min);
    const maxMonth = startOfMonth(max);

    if (monthStart.getTime() < minMonth.getTime()) {
        return minMonth;
    }
    if (monthStart.getTime() > maxMonth.getTime()) {
        return maxMonth;
    }
    return monthStart;
}

function defaultViewDate(defaultViewYearsAgo: number, maxDate: Date): Date {
    if (defaultViewYearsAgo <= 0) {
        return startOfMonth(maxDate);
    }
    return new Date(maxDate.getFullYear() - defaultViewYearsAgo, maxDate.getMonth(), 1);
}

const headerSelectClass =
    'rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-2 pr-7 text-sm font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none select-chevron-sm';

function DatePicker({
    label = 'Date',
    required = false,
    value,
    errorMessage,
    onChange,
    children,
    placeholder = 'Select date',
    minDate,
    maxDate,
    defaultViewYearsAgo = 20,
    className = 'mt-5',
}: DatePickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const today = useMemo(() => startOfDay(new Date()), []);

    const resolvedMaxDate = useMemo(
        () => (maxDate ? startOfDay(maxDate) : today),
        [maxDate, today],
    );

    const resolvedMinDate = useMemo(
        () =>
            minDate
                ? startOfDay(minDate)
                : new Date(resolvedMaxDate.getFullYear() - 120, resolvedMaxDate.getMonth(), resolvedMaxDate.getDate()),
        [minDate, resolvedMaxDate],
    );

    const [viewDate, setViewDate] = useState<Date>(() =>
        clampViewDate(
            parseIsoDate(value) ?? defaultViewDate(defaultViewYearsAgo, resolvedMaxDate),
            resolvedMinDate,
            resolvedMaxDate,
        ),
    );

    useEffect(() => {
        if (open) {
            setViewDate(
                clampViewDate(
                    parseIsoDate(value) ?? defaultViewDate(defaultViewYearsAgo, resolvedMaxDate),
                    resolvedMinDate,
                    resolvedMaxDate,
                ),
            );
        }
    }, [open, value, defaultViewYearsAgo, resolvedMaxDate, resolvedMinDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const yearOptions = useMemo(() => {
        const years: number[] = [];
        for (let year = resolvedMaxDate.getFullYear(); year >= resolvedMinDate.getFullYear(); year -= 1) {
            years.push(year);
        }
        return years;
    }, [resolvedMinDate, resolvedMaxDate]);

    const calendarDays = useMemo(() => {
        const firstOfMonth = startOfMonth(viewDate);
        const startOffset = firstOfMonth.getDay();
        const gridStart = new Date(firstOfMonth);
        gridStart.setDate(gridStart.getDate() - startOffset);

        return Array.from({ length: 42 }, (_, index) => {
            const date = new Date(gridStart);
            date.setDate(gridStart.getDate() + index);
            return date;
        });
    }, [viewDate]);

    const selectedDate = parseIsoDate(value);

    const isSelectable = (date: Date) =>
        !isBeforeDay(date, resolvedMinDate) && !isAfterDay(date, resolvedMaxDate);

    const handleSelect = (date: Date) => {
        if (!isSelectable(date)) return;
        onChange(toIsoDate(date.getFullYear(), date.getMonth(), date.getDate()));
        setOpen(false);
    };

    const goToPreviousMonth = () => {
        setViewDate((current) =>
            clampViewDate(
                new Date(current.getFullYear(), current.getMonth() - 1, 1),
                resolvedMinDate,
                resolvedMaxDate,
            ),
        );
    };

    const goToNextMonth = () => {
        setViewDate((current) =>
            clampViewDate(
                new Date(current.getFullYear(), current.getMonth() + 1, 1),
                resolvedMinDate,
                resolvedMaxDate,
            ),
        );
    };

    const previousMonthStart = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const canGoPrevious = previousMonthStart >= startOfMonth(resolvedMinDate);

    const nextMonthStart = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    const canGoNext = nextMonthStart <= startOfMonth(resolvedMaxDate);

    const handleMonthChange = (month: number) => {
        setViewDate((current) =>
            clampViewDate(new Date(current.getFullYear(), month, 1), resolvedMinDate, resolvedMaxDate),
        );
    };

    const handleYearChange = (year: number) => {
        setViewDate((current) =>
            clampViewDate(new Date(year, current.getMonth(), 1), resolvedMinDate, resolvedMaxDate),
        );
    };

    return (
        <div className={className} ref={containerRef}>
            <FormLabel required={required}>{label}</FormLabel>

            <div className="mt-2 relative text-gray-400 focus-within:text-gray-600 transition-all duration-200">
                {children && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                        {children}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setOpen((current) => !current)}
                    className={`block w-full py-3 ${children ? 'pl-12' : 'pl-4'} pr-4 text-left transition-all duration-200 border rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white ${
                        errorMessage
                            ? 'text-red-700 border-red-200 bg-red-50'
                            : value
                              ? 'text-black border-gray-200 bg-gray-50'
                              : 'text-gray-500 border-gray-200 bg-gray-50'
                    }`}
                >
                    {value ? formatDisplayDate(value) : placeholder}
                </button>

                {open && (
                    <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                        <div className="mb-3 flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={goToPreviousMonth}
                                disabled={!canGoPrevious}
                                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <select
                                value={viewDate.getMonth()}
                                onChange={(e) => handleMonthChange(Number(e.target.value))}
                                className={`${headerSelectClass} min-w-0 flex-1`}
                                aria-label="Select month"
                            >
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index}>
                                        {MONTHS_SHORT[index]}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={viewDate.getFullYear()}
                                onChange={(e) => handleYearChange(Number(e.target.value))}
                                className={`${headerSelectClass} w-[5.5rem] shrink-0`}
                                aria-label="Select year"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={goToNextMonth}
                                disabled={!canGoNext}
                                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Next month"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-2 grid grid-cols-7 gap-1">
                            {WEEKDAYS.map((day) => (
                                <div
                                    key={day}
                                    className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((date) => {
                                const inCurrentMonth = date.getMonth() === viewDate.getMonth();
                                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                                const isToday = isSameDay(date, today);
                                const selectable = isSelectable(date);
                                const isDisabled = !inCurrentMonth || !selectable;

                                return (
                                    <button
                                        key={date.toISOString()}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => handleSelect(date)}
                                        className={`h-9 rounded-xl text-sm transition-colors ${
                                            isSelected
                                                ? 'bg-[#E85A2E] font-semibold text-white'
                                                : isDisabled
                                                  ? inCurrentMonth
                                                      ? 'cursor-not-allowed text-gray-300'
                                                      : 'cursor-default text-gray-300'
                                                  : isToday
                                                    ? 'font-semibold text-[#E85A2E] ring-1 ring-[#E85A2E]/40 hover:bg-[#E85A2E]/10'
                                                    : 'text-slate-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {errorMessage && (
                <small className="text-red-500 font-semibold mt-2 flex items-center">
                    <span className="ml-2">{errorMessage}</span>
                </small>
            )}
        </div>
    );
}

export default DatePicker;
