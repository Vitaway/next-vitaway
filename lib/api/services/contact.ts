import { post } from '../client';
import { ContactPayload, ContactResponse } from '../types';

/**
 * Contact Service
 * Handles all contact form related API calls
 */
export const contactService = {
    /**
     * Submit contact form
     */
    submit: async (payload: ContactPayload): Promise<ContactResponse> => {
        const response = await post<ContactResponse>('/api/contact', payload);
        return response;
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
