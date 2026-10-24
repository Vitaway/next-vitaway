/** Vitaway EHR API. Override with NEXT_PUBLIC_BOOKING_API_URL. */
const STAGING_BOOKING_API = 'https://care-api.vitaway.org';

/**
 * Bookings, pre-registrations, organizations, and referral coaches go to the clinic API.
 * The rest of the marketing site still uses NEXT_PUBLIC_ENVENTORY_API_URL.
 */
export function publicConsumerBase(): string {
    const booking = process.env.NEXT_PUBLIC_BOOKING_API_URL?.replace(/\/$/, '');
    return booking || STAGING_BOOKING_API;
}
