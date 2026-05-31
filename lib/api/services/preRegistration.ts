import { post } from '../client';
import { PreRegistrationPayload, PreRegistrationResponse } from '../types';

export const preRegistrationService = {
    submit: async (payload: PreRegistrationPayload): Promise<PreRegistrationResponse> => {
        const response = await post<PreRegistrationResponse>(
            '/api/pre-registrations',
            payload
        );
        return response;
    },

    validate: {
        step1: (data: Partial<PreRegistrationPayload>): string[] => {
            const errors: string[] = [];
            if (!data.joining_as) {
                errors.push('Please select how you are joining us.');
            }
            return errors;
        },

        step2: (data: Partial<PreRegistrationPayload>): string[] => {
            const errors: string[] = [];
            if (!data.full_name || data.full_name.trim().length < 2) {
                errors.push('Full name must be at least 2 characters.');
            }
            if (!data.phone_number || data.phone_number.trim().length < 8) {
                errors.push('Please provide a valid phone number.');
            }
            if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                errors.push('Please provide a valid email address.');
            }
            return errors;
        },

        step3: (): string[] => {
            return [];
        },

        step4: (): string[] => {
            return [];
        },

        step5: (): string[] => {
            return [];
        },

        step6: (data: Partial<PreRegistrationPayload>): string[] => {
            const errors: string[] = [];
            if (!data.consent_privacy_policy) errors.push('You must accept the privacy policy.');
            if (!data.consent_data_usage) errors.push('You must consent to data usage.');
            if (!data.consent_health_information) errors.push('You must consent to health information handling.');
            if (!data.consent_wellness_program) errors.push('You must consent to the wellness program.');
            return errors;
        },
    },
};
