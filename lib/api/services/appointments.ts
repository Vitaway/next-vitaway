import { post } from '../client';
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
        const response = await post<AppointmentResponse>(
            '/api/appointments/business',
            payload
        );
        return response;
    },

    /**
     * Validate appointment data before submission
     */
    validate: (payload: AppointmentPayload): string[] => {
        const errors: string[] = [];

        if (!payload.name || payload.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            errors.push('Please provide a valid email address');
        }

        if (!payload.phone || payload.phone.trim().length < 10) {
            errors.push('Please provide a valid phone number');
        }

        if (!payload.subject || payload.subject.trim().length < 3) {
            errors.push('Subject must be at least 3 characters long');
        }

        if (!payload.message || payload.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        if (!payload.type) {
            errors.push('Please select an appointment type');
        }

        if (!payload.appointment_date) {
            errors.push('Please select an appointment date');
        }

        if (!payload.appointment_time) {
            errors.push('Please select an appointment time');
        }

        return errors;
    },
};
