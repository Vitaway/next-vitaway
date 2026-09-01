import { CountryDialCode } from './country-codes';

export function normalizeLocalPhoneDigits(localPhone: string): string {
    let digits = localPhone.replace(/\D/g, '');

    if (digits.startsWith('0')) {
        digits = digits.slice(1);
    }

    return digits;
}

export function formatFullPhone(localPhone: string, country: CountryDialCode): string {
    const digits = normalizeLocalPhoneDigits(localPhone);

    if (!digits) {
        return '';
    }

    return `+${country.dialCode}${digits}`;
}

export function isValidLocalPhone(localPhone: string, country: CountryDialCode): boolean {
    const digits = localPhone.replace(/\D/g, '');

    if (!digits) {
        return false;
    }

    if (country.iso2 === 'RW') {
        const normalized = normalizeLocalPhoneDigits(localPhone);
        return /^(78|72|73|79)\d{7}$/.test(normalized);
    }

    const normalized = normalizeLocalPhoneDigits(localPhone);
    return normalized.length >= 4 && normalized.length <= 14;
}

export function phonePlaceholder(country: CountryDialCode): string {
    if (country.iso2 === 'RW') {
        return '78XXXXXXX';
    }

    return 'Phone number';
}
