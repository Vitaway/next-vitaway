/** Browser network status for booking / referral actions. */

export function isOnline() {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
}

export function offlineBookingMessage() {
    return 'You are offline. Connect to the internet to book.';
}
