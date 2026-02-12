import { useState, useCallback } from 'react';
import { contactService } from '@/lib/api';
import { ContactPayload } from '@/lib/api/types';
import { APIError } from '@/lib/api/client';

interface UseContactReturn {
    submitting: boolean;
    success: string | null;
    error: string | null;
    submitContact: (payload: ContactPayload) => Promise<boolean>;
    reset: () => void;
}

/**
 * Custom hook for submitting contact form
 * @returns Contact form submission state and functions
 */
export const useContact = (): UseContactReturn => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submitContact = useCallback(async (payload: ContactPayload): Promise<boolean> => {
        try {
            setSubmitting(true);
            setError(null);
            setSuccess(null);

            // Validate payload
            const validationErrors = contactService.validate(payload);
            if (validationErrors.length > 0) {
                setError(validationErrors.join(', '));
                return false;
            }

            // Submit contact form
            await contactService.submit(payload);
            setSuccess('Message sent successfully! We will get back to you soon.');
            return true;
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to send message. Please try again later.';
            setError(errorMessage);
            console.error('Error submitting contact form:', err);
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
        submitContact,
        reset,
    };
};
