export type NavLink = {
    href: string;
    label: string;
};

/** Full lists for mobile / footer */
export const individualLinks: NavLink[] = [
    { href: '/for-individuals', label: 'Overview' },
    { href: '/for-individuals/health-check', label: 'Health Check' },
    { href: '/for-individuals/12-week-programme', label: '12-Week Programme' },
    { href: '/for-individuals/continued-care', label: 'Continued Care' },
    { href: '/for-individuals/weight', label: 'Weight and metabolic health' },
    { href: '/for-individuals/blood-pressure', label: 'Blood pressure' },
    { href: '/for-individuals/blood-sugar', label: 'Blood sugar' },
    { href: '/for-individuals/family', label: 'Family and child nutrition' },
];

export const organizationLinks: NavLink[] = [
    { href: '/for-organizations', label: 'Overview' },
    { href: '/for-organizations/companies', label: 'Companies' },
    { href: '/for-organizations/embassies', label: 'Embassies and missions' },
    { href: '/for-organizations/ngos', label: 'NGOs' },
    { href: '/for-organizations/schools', label: 'Schools' },
];

/** Compact labels for the teal secondary bar */
export const individualTealLinks: NavLink[] = [
    { href: '/for-individuals', label: 'Overview' },
    { href: '/for-individuals/health-check', label: 'Health Check' },
    { href: '/for-individuals/12-week-programme', label: '12-Week Programme' },
    { href: '/for-individuals/continued-care', label: 'Continued Care' },
    { href: '/for-individuals/weight', label: 'Weight' },
    { href: '/for-individuals/blood-pressure', label: 'Blood pressure' },
    { href: '/for-individuals/blood-sugar', label: 'Blood sugar' },
    { href: '/for-individuals/family', label: 'Family' },
];

export const organizationTealLinks: NavLink[] = [
    { href: '/for-organizations', label: 'Overview' },
    { href: '/for-organizations/companies', label: 'Companies' },
    { href: '/for-organizations/embassies', label: 'Embassies' },
    { href: '/for-organizations/ngos', label: 'NGOs' },
    { href: '/for-organizations/schools', label: 'Schools' },
];

export const defaultTealLinks: NavLink[] = [
    { href: '/for-individuals', label: 'How We Can Help' },
    { href: '/success-stories', label: 'Success Stories' },
    { href: '/about-us', label: 'Who We Are' },
    { href: '/faqs', label: 'FAQs' },
    { href: '/contacts', label: 'Support' },
];
