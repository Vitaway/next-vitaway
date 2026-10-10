/** Staging clinic API. Swap NEXT_PUBLIC_BOOKING_API_URL when the desk moves to production. */
const STAGING_BOOKING_API = 'https://vitaway.keyypress.com';

/**
 * Bookings, pre-registrations, organizations, and referral coaches go to the clinic API.
 * The rest of the marketing site still uses NEXT_PUBLIC_ENVENTORY_API_URL.
 */
export function publicConsumerBase(): string {
    const booking = process.env.NEXT_PUBLIC_BOOKING_API_URL?.replace(/\/$/, '');
    return booking || STAGING_BOOKING_API;
}
