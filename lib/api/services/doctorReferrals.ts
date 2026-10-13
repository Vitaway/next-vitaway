import axios from 'axios';
import { APIError } from '../client';
import { publicConsumerBase } from '../public-consumer-base';

export type ResolvedDoctor = {
    code: string;
    full_name: string;
    clinic_name: string | null;
};

export type DoctorReferralPayload = {
    doctor_code?: string;
    doctor_name?: string;
    doctor_clinic?: string;
    doctor_phone?: string;
    patient_name: string;
    patient_phone: string;
    patient_email?: string;
    reason: string;
    reason_other?: string;
    consent: boolean;
    appointment_date: string;
    appointment_time: string;
    confirm_near?: boolean;
};

export type DoctorReferralResult = {
    id: string;
    reference: string;
    patient_name: string;
    doctor_name: string;
    doctor_clinic: string | null;
    reason: string;
    appointment_date?: string;
    appointment_time?: string;
    when_label?: string;
};

export type NearAppointmentError = {
    when_label: string;
    message: string;
};

type LaravelBody<T> = {
    success?: boolean;
    message?: string;
    error?: string;
    data?: T;
    errors?: { code?: string; when_label?: string };
};

function apiMessage(data: unknown, fallback: string) {
    if (!data || typeof data !== 'object') return fallback;
    const body = data as { message?: string; error?: string };
    return body.message || body.error || fallback;
}

async function laravelGet<T>(path: string, params?: Record<string, string>) {
    try {
        const response = await axios.get<LaravelBody<T>>(`${publicConsumerBase()}${path}`, {
            params,
            headers: { Accept: 'application/json' },
            timeout: 15_000,
        });
        const body = response.data;
        if (body && body.success === false) {
            throw new APIError(apiMessage(body, 'Request failed'), response.status, body);
        }
        return body;
    } catch (error) {
        if (error instanceof APIError) throw error;
        if (axios.isAxiosError(error)) {
            throw new APIError(
                apiMessage(error.response?.data, 'Could not reach Vitaway. Try again.'),
                error.response?.status,
                error.response?.data,
            );
        }
        throw error;
    }
}

async function laravelPost<T>(path: string, payload: unknown) {
    try {
        const response = await axios.post<LaravelBody<T>>(`${publicConsumerBase()}${path}`, payload, {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            timeout: 15_000,
        });
        const body = response.data;
        if (body && body.success === false) {
            throw new APIError(apiMessage(body, 'Request failed'), response.status, body);
        }
        return body;
    } catch (error) {
        if (error instanceof APIError) throw error;
        if (axios.isAxiosError(error)) {
            throw new APIError(
                apiMessage(error.response?.data, 'Could not send the referral. Try again.'),
                error.response?.status,
                error.response?.data,
            );
        }
        throw error;
    }
}

export function nearAppointmentFromError(err: unknown): NearAppointmentError | null {
    if (!(err instanceof APIError) || err.statusCode !== 409 || !err.data || typeof err.data !== 'object') {
        return null;
    }
    const body = err.data as LaravelBody<unknown>;
    if (body.errors?.code !== 'near_appointment') return null;
    return {
        when_label: body.errors.when_label || '',
        message:
            body.message ||
            'This client already has a Vitaway visit around that time. Book another only if they still need it.',
    };
}

export const doctorReferralService = {
    resolve: async (code: string): Promise<ResolvedDoctor> => {
        const body = await laravelGet<ResolvedDoctor>('/api/referring-doctors/resolve', {
            code: code.trim(),
        });
        if (!body.data) throw new APIError(body.message || 'Ask Vitaway for your referral code.', 404);
        return body.data;
    },

    create: async (payload: DoctorReferralPayload): Promise<DoctorReferralResult> => {
        const body = await laravelPost<DoctorReferralResult>('/api/doctor-referrals', payload);
        if (!body.data) throw new APIError(body.message || 'Could not send the referral.', 400);
        return body.data;
    },
};
