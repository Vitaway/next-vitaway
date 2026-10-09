import axios from 'axios';
import { isSlotBookable } from '@/lib/appointment-slots';
import { APIError } from '../client';
import { publicConsumerBase } from '../public-consumer-base';
import { AppointmentPayload, AppointmentResponse } from '../types';

/**
 * Appointment Service
 * Handles all appointment-related API calls
 */
export const appointmentService = {
    /**
     * Create a new business appointment
     */
    create: async (payload: AppointmentPayload): Promise<AppointmentResponse> => {
        try {
            const response = await axios.post<AppointmentResponse>(
                `${publicConsumerBase()}/api/appointments/business`,
                payload,
                { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
            );
            const body = response.data as AppointmentResponse & { success?: boolean; message?: string };
            if (body && body.success === false) {
                throw new APIError(body.message || 'Could not book that visit', response.status, body);
            }
            return body;
        } catch (error) {
            if (error instanceof APIError) throw error;
            if (axios.isAxiosError(error)) {
                const data = error.response?.data as { message?: string } | undefined;
                throw new APIError(
                    data?.message || 'Could not book that visit. Please try again.',
                    error.response?.status,
                    error.response?.data,
                );
            }
            throw error;
        }
    },

    /**
     * Validate appointment data before submission
     */
    validate: (payload: AppointmentPayload): string[] => {
        const errors: string[] = [];

        if (!payload.name || payload.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (payload.email && payload.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            errors.push('Please provide a valid email address');
        }

        if (!payload.phone || payload.phone.trim().length < 10) {
            errors.push('Please provide a valid phone number');
        }

        if (!payload.appointment_date) {
            errors.push('Please select an appointment date');
        }

        if (!payload.appointment_time) {
            errors.push('Please select an appointment time');
        } else if (
            payload.appointment_date &&
            !isSlotBookable(payload.appointment_date, payload.appointment_time)
        ) {
            errors.push('Please pick a time at least one hour from now');
        }

        return errors;
    },
};
