'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    COUNTRY_DIAL_CODE_OPTIONS,
    DEFAULT_COUNTRY_ISO2,
    countryOptionLabel,
    getCountryByIso2,
    getDefaultCountry,
} from '@/lib/country-codes';
import {
    formatFullPhone,
    isValidLocalPhone,
    parseStoredPhone,
    phonePlaceholder,
} from '@/lib/phone';
import FormLabel from './FormLabel';

interface PhoneInputProps {
    label?: string;
    required?: boolean;
    value: string;
    errorMessage?: string;
    onChange: (value: string) => void;
    children?: React.ReactNode;
    compact?: boolean;
}

function PhoneInput({
    label = 'Phone Number',
    required = false,
    value,
    errorMessage,
    onChange,
    children,
    compact = false,
}: PhoneInputProps) {
    const initial = useMemo(() => parseStoredPhone(value), [value]);
    const [countryIso2, setCountryIso2] = useState(initial.iso2);
    const [localPhone, setLocalPhone] = useState(initial.local);

    const selectedCountry = useMemo(
        () => getCountryByIso2(countryIso2) ?? getDefaultCountry(),
        [countryIso2],
    );

    useEffect(() => {
        const parsed = parseStoredPhone(value);
        setCountryIso2(parsed.iso2);
        setLocalPhone(parsed.local);
    }, [value]);

    const showInlineError =
        localPhone.length > 0 && !isValidLocalPhone(localPhone, selectedCountry);

    const inputClass = `block w-full py-3 px-4 font-normal transition duration-200 border rounded-2xl appearance-none focus:outline-none focus:border-[#003E48] focus:bg-white caret-[#003E48] ${
        errorMessage || showInlineError
            ? 'text-red-700 border-red-200 bg-red-50'
            : 'text-[#003E48] placeholder:text-[#003E48]/40 border-transparent bg-[#F6F3EE]'
    }`;

    const selectClass = `${inputClass} appearance-none bg-no-repeat bg-[length:16px] bg-[right_12px_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%23003E48%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpath%20d=%27m6%209%206%206%206-6%27/%3e%3c/svg%3e')] pr-10`;

    const handleCountryChange = (iso2: string) => {
        setCountryIso2(iso2);
        const country = getCountryByIso2(iso2) ?? getDefaultCountry();
        onChange(formatFullPhone(localPhone, country));
    };

    const handleLocalChange = (nextLocal: string) => {
        let digits = nextLocal.replace(/\D/g, '');
        const country = getCountryByIso2(countryIso2) ?? getDefaultCountry();

        if (country.iso2 === 'RW' && digits.startsWith('0')) {
            digits = digits.slice(1);
        }

        setLocalPhone(digits);
        onChange(formatFullPhone(digits, country));
    };

    return (
        <div className="mt-5">
            <FormLabel required={required}>{label}</FormLabel>

            <div className={`mt-2 ${compact ? 'flex h-12 overflow-hidden rounded-2xl bg-[#F6F3EE] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#003E48]' : 'flex flex-col gap-2 sm:flex-row'}`}>
                {compact ? (
                    <>
                        <select
                            value={countryIso2}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            className="w-[3.4rem] shrink-0 appearance-none bg-transparent py-0 pl-2.5 pr-0 text-[11px] font-semibold leading-none text-[#003E48]/65 outline-none"
                            aria-label="Country code"
                        >
                            {COUNTRY_DIAL_CODE_OPTIONS.map((country) => (
                                <option key={country.iso2} value={country.iso2}>
                                    +{country.dialCode}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            inputMode="numeric"
                            value={localPhone}
                            onChange={(e) => handleLocalChange(e.target.value)}
                            placeholder={phonePlaceholder(selectedCountry)}
                            maxLength={selectedCountry.iso2 === 'RW' ? 9 : 15}
                            className="min-w-0 flex-1 bg-transparent px-2 text-[#003E48] outline-none placeholder:text-[#003E48]/40"
                        />
                    </>
                ) : (
                    <>
                <select
                    value={countryIso2}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`${selectClass} sm:w-[11.5rem] sm:shrink-0`}
                    aria-label="Country code"
                >
                    {COUNTRY_DIAL_CODE_OPTIONS.map((country) => (
                        <option key={country.iso2} value={country.iso2}>
                            {countryOptionLabel(country)}
                        </option>
                    ))}
                </select>

                <div className="relative flex-1 text-[#003E48]/40 focus-within:text-[#003E48]">
                    {children && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            {children}
                        </div>
                    )}
                    <input
                        type="tel"
                        inputMode="numeric"
                        value={localPhone}
                        onChange={(e) => handleLocalChange(e.target.value)}
                        placeholder={phonePlaceholder(selectedCountry)}
                        maxLength={selectedCountry.iso2 === 'RW' ? 9 : 15}
                        className={`${inputClass} ${children ? 'pl-12' : ''}`}
                    />
                </div>
                    </>
                )}
            </div>

            {(errorMessage || showInlineError) && (
                <small className="text-red-500 font-semibold mt-2 flex items-center">
                    <span className="ml-2">
                        {errorMessage ||
                            (selectedCountry.iso2 === 'RW'
                                ? 'Enter a valid number starting with 78, 72, 73, or 79 (without the leading 0).'
                                : 'Enter a valid phone number for the selected country.')}
                    </span>
                </small>
            )}
        </div>
    );
}

export default PhoneInput;
