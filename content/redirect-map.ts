/**
 * P1 launch redirect map.
 * permanent: true = 301, false = 302.
 * statusHint documents intended HTTP status for ops (Next only supports 301/302/307/308 via permanent).
 */
export type SiteRedirect = {
    source: string;
    destination: string;
    permanent: boolean;
    /** For spreadsheet / ops; Next uses permanent for 301 vs 308-style permanence */
    note?: string;
};

export const siteRedirects: SiteRedirect[] = [
    // Audience hubs
    { source: '/individuals', destination: '/for-individuals', permanent: true },
    { source: '/indivituals', destination: '/for-individuals', permanent: true },
    { source: '/serves', destination: '/for-organizations', permanent: true },

    // Retired pricing page
    { source: '/pricing', destination: '/for-individuals', permanent: true },

    // Assessments hub → health check (quiz detail routes stay live)
    { source: '/assessments', destination: '/for-individuals/health-check', permanent: true },

    // Old condition / programme URLs → new offering pages
    { source: '/diabetes', destination: '/for-individuals/blood-sugar', permanent: true },
    { source: '/blood-sugar', destination: '/for-individuals/blood-sugar', permanent: true },
    { source: '/hypertension', destination: '/for-individuals/blood-pressure', permanent: true },
    { source: '/blood-pressure', destination: '/for-individuals/blood-pressure', permanent: true },
    { source: '/weight', destination: '/for-individuals/weight', permanent: true },
    { source: '/weight-management', destination: '/for-individuals/weight', permanent: true },
    { source: '/programs/well-being', destination: '/for-individuals/blood-sugar', permanent: true },

    // Legacy spelling / aliases
    { source: '/for-organisation', destination: '/for-organizations', permanent: true },
    { source: '/for-organisations', destination: '/for-organizations', permanent: true },
    { source: '/success-story', destination: '/success-stories', permanent: true },
    { source: '/stories', destination: '/success-stories', permanent: true },
];
