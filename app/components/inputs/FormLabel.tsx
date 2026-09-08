'use client';

import React from 'react';

export function RequiredMark() {
    return <span className="text-red-500 mr-0.5">*</span>;
}

interface FormLabelProps {
    children: React.ReactNode;
    required?: boolean;
    className?: string;
}

function FormLabel({ children, required = false, className = '' }: FormLabelProps) {
    return (
        <label className={`font-semibold text-[#003E48] capitalize text-md ${className}`}>
            {required ? <RequiredMark /> : null}
            {children}
        </label>
    );
}

export default FormLabel;
