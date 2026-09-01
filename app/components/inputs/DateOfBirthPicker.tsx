'use client';

import React from 'react';
import DatePicker, { DatePickerProps } from './DatePicker';

type DateOfBirthPickerProps = Omit<
    DatePickerProps,
    'placeholder' | 'defaultViewYearsAgo' | 'minDate' | 'maxDate'
>;

function DateOfBirthPicker(props: DateOfBirthPickerProps) {
    return (
        <DatePicker
            {...props}
            label={props.label ?? 'Date of Birth'}
            placeholder="Select date of birth"
            defaultViewYearsAgo={20}
        />
    );
}

export default DateOfBirthPicker;
