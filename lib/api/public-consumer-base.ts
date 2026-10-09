/**
 * Bookings, organizations, and referral coaches live on core-backend.
 * The rest of the marketing site can still talk to the URL in
 * NEXT_PUBLIC_ENVENTORY_API_URL. Locally that URL is often the old
 * Laravel app, which stores a visit and does not send the confirmation.
 */
export function publicConsumerBase(): string {
    const booking = process.env.NEXT_PUBLIC_BOOKING_API_URL?.replace(/\/$/, '');
    if (booking) return booking;

    const configured = (process.env.NEXT_PUBLIC_ENVENTORY_API_URL || '').replace(/\/$/, '');
    if (/^https?:\/\/(127\.0\.0\.1|localhost):8001$/i.test(configured)) {
        return 'http://127.0.0.1:3020';
    }
    return configured;
}
