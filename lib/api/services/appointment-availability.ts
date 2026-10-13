import axios from 'axios';
import { APIError } from '../client';
import { publicConsumerBase } from '../public-consumer-base';

type LaravelBody<T> = {
    success?: boolean;
    message?: string;
    error?: string;
    data?: T;
};

export type DayAvailability = {
    date: string;
    times: string[];
};

/** Free clinic clocks for a day (server removes taken slots). */
export async function fetchDayAvailability(date: string): Promise<string[]> {
    if (!date) return [];
    try {
        const response = await axios.get<LaravelBody<DayAvailability>>(
            `${publicConsumerBase()}/api/appointments/availability`,
            {
                params: { date },
                headers: { Accept: 'application/json' },
                timeout: 15_000,
            },
        );
        const body = response.data;
        if (body && body.success === false) {
            throw new APIError(body.message || body.error || 'Could not load times', response.status, body);
        }
        return Array.isArray(body.data?.times) ? body.data.times : [];
    } catch (error) {
        if (error instanceof APIError) throw error;
        if (axios.isAxiosError(error)) {
            throw new APIError(
                (error.response?.data as { message?: string } | undefined)?.message ||
                    'Could not load available times.',
                error.response?.status,
                error.response?.data,
            );
        }
        throw error;
    }
}
