import {
    COUNTRY_DIAL_CODES,
    CountryDialCode,
    DEFAULT_COUNTRY_ISO2,
    getCountryByIso2,
} from './country-codes';

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

export function parseStoredPhone(phone: string): { iso2: string; local: string } {
    const trimmed = phone.trim();

    if (!trimmed) {
        return { iso2: DEFAULT_COUNTRY_ISO2, local: '' };
    }

    if (trimmed.startsWith('+')) {
        const sortedCountries = [...COUNTRY_DIAL_CODES].sort(
            (a, b) => b.dialCode.length - a.dialCode.length,
        );

        for (const country of sortedCountries) {
            const prefix = `+${country.dialCode}`;
            if (trimmed.startsWith(prefix)) {
                return {
                    iso2: country.iso2,
                    local: normalizeLocalPhoneDigits(trimmed.slice(prefix.length)),
                };
            }
        }
    }

    return {
        iso2: DEFAULT_COUNTRY_ISO2,
        local: normalizeLocalPhoneDigits(trimmed),
    };
}

export function isValidFullPhone(phone: string): boolean {
    const parsed = parseStoredPhone(phone);
    const country = getCountryByIso2(parsed.iso2);

    if (!country) {
        return false;
    }

    return isValidLocalPhone(parsed.local, country);
}
