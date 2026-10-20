import { useState, useCallback } from 'react';
import { appointmentService } from '@/lib/api';
import { AppointmentPayload, VisitPayment } from '@/lib/api/types';
import { APIError } from '@/lib/api/client';
import { isOnline, offlineBookingMessage } from '@/lib/online';

export type NearAppointmentNotice = {
    when_label: string;
    message: string;
};

type CreateResult = { ok: true; payment?: VisitPayment } | { ok: false; near?: NearAppointmentNotice };

interface UseAppointmentReturn {
    submitting: boolean;
    success: string | null;
    error: string | null;
    createAppointment: (payload: AppointmentPayload) => Promise<CreateResult>;
    reset: () => void;
}

function nearFromError(err: APIError): NearAppointmentNotice | null {
    if (err.statusCode !== 409 || !err.data || typeof err.data !== 'object') return null;
    const body = err.data as {
        message?: string;
        errors?: { code?: string; when_label?: string };
    };
    if (body.errors?.code !== 'near_appointment') return null;
    return {
        when_label: body.errors.when_label || '',
        message:
            body.message ||
            'You already have a Vitaway visit around that time. Book another only if you still need it.',
    };
}

/**
 * Custom hook for creating appointments
 */
export const useAppointment = (): UseAppointmentReturn => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const createAppointment = useCallback(async (payload: AppointmentPayload): Promise<CreateResult> => {
        try {
            setSubmitting(true);
            setError(null);
            setSuccess(null);

            if (!isOnline()) {
                setError(offlineBookingMessage());
                return { ok: false };
            }

            const validationErrors = appointmentService.validate(payload);
            if (validationErrors.length > 0) {
                setError(validationErrors.join(', '));
                return { ok: false };
            }

            const created = await appointmentService.create(payload);
            if (created.data?.payment) return { ok: true, payment: created.data.payment };
            setSuccess('Your visit is booked.');
            return { ok: true };
        } catch (err) {
            if (err instanceof APIError) {
                const near = nearFromError(err);
                if (near) {
                    setError(null);
                    return { ok: false, near };
                }
            }

            let errorMessage =
                err instanceof APIError
                    ? err.message
                    : 'Failed to book appointment. Please try again later.';

            if (err instanceof APIError && err.data && typeof err.data === 'object') {
                const payload = err.data as {
                    message?: string;
                    errors?: Record<string, string[]>;
                };
                const fieldErrors = payload.errors ? Object.values(payload.errors).flat() : [];
                if (fieldErrors.length > 0 && typeof fieldErrors[0] === 'string') {
                    errorMessage = fieldErrors.join(', ');
                } else if (payload.message) {
                    errorMessage = payload.message;
                }
            }

            setError(errorMessage);
            console.error('Error creating appointment:', err);
            return { ok: false };
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
