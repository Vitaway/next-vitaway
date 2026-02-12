import { useState, useCallback } from 'react';
import { appointmentService } from '@/lib/api';
import { AppointmentPayload } from '@/lib/api/types';
import { APIError } from '@/lib/api/client';

interface UseAppointmentReturn {
    submitting: boolean;
    success: string | null;
    error: string | null;
    createAppointment: (payload: AppointmentPayload) => Promise<boolean>;
    reset: () => void;
}

/**
 * Custom hook for creating appointments
 * @returns Appointment submission state and functions
 */
export const useAppointment = (): UseAppointmentReturn => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const createAppointment = useCallback(async (payload: AppointmentPayload): Promise<boolean> => {
        try {
            setSubmitting(true);
            setError(null);
            setSuccess(null);

            // Validate payload
            const validationErrors = appointmentService.validate(payload);
            if (validationErrors.length > 0) {
                setError(validationErrors.join(', '));
                return false;
            }

            // Submit appointment
            await appointmentService.create(payload);
            setSuccess('Appointment booked successfully! We will contact you soon.');
            return true;
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to book appointment. Please try again later.';
            setError(errorMessage);
            console.error('Error creating appointment:', err);
            return false;
        } finally {
            setSubmitting(false);
        }
    }, []);

    const reset = useCallback(() => {
        setSuccess(null);
        setError(null);
        setSubmitting(false);
    }, []);

    return {
        submitting,
        success,
        error,
        createAppointment,
        reset,
    };
};
