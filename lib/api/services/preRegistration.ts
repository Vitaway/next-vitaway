import axios from 'axios';
import { APIError } from '../client';
import { publicConsumerBase } from '../public-consumer-base';
import { PreRegistrationPayload, PreRegistrationResponse } from '../types';
import { isValidFullPhone } from '@/lib/phone';

export const preRegistrationService = {
    submit: async (payload: PreRegistrationPayload): Promise<PreRegistrationResponse> => {
        try {
            const response = await axios.post<PreRegistrationResponse>(
                `${publicConsumerBase()}/api/pre-registrations`,
                payload,
                { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
            );
            const body = response.data as PreRegistrationResponse & { success?: boolean; message?: string };
            if (body && body.success === false) {
                throw new APIError(body.message || 'Submission failed. Please try again.', response.status, body);
            }
            return body;
        } catch (error) {
            if (error instanceof APIError) throw error;
            if (axios.isAxiosError(error)) {
                const data = error.response?.data as { message?: string } | undefined;
                throw new APIError(
                    data?.message || 'Submission failed. Please check your connection and try again.',
                    error.response?.status,
                    error.response?.data,
                );
            }
            throw error;
        }
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
            if (!data.phone_number || !isValidFullPhone(data.phone_number)) {
                errors.push('Please provide a valid phone number.');
            }
            if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                errors.push('Please provide a valid email address.');
            }
            if (!data.organization_id && (!data.organization_other || data.organization_other.trim().length < 2)) {
                errors.push('Please select an organization or enter a custom organization name.');
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
