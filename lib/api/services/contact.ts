import { ContactPayload, ContactResponse } from '../types';
import { APIError } from '../client';

/**
 * Contact Service
 * Submits the support form to the Next.js API, which emails support@vitaway.org
 */
export const contactService = {
    /**
     * Submit contact form
     */
    submit: async (payload: ContactPayload): Promise<ContactResponse> => {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = (await response.json().catch(() => ({}))) as ContactResponse & {
            message?: string;
        };

        if (!response.ok) {
            throw new APIError(
                data.message || 'Failed to send message. Please try again later.',
                response.status,
                data,
            );
        }

        return data;
    },

    /**
     * Validate contact form data before submission
     */
    validate: (payload: ContactPayload): string[] => {
        const errors: string[] = [];

        if (!payload.fullname || payload.fullname.trim().length < 2) {
            errors.push('Full name must be at least 2 characters long');
        }

        if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            errors.push('Please provide a valid email address');
        }

        if (!payload.message || payload.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        return errors;
    },
};
