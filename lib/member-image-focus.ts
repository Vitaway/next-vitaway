/** Per-member crop so faces sit well in cover/contain frames. */
export const MEMBER_IMAGE_FOCUS: Record<string, string> = {
    'Jean-Claude-Mugunga': 'object-cover object-[center_18%]',
    'ally-niyonkuru': 'object-cover object-[center_22%]',
    'marthe-umuhire': 'object-cover object-[center_28%]',
    'olga-nelly': 'object-cover object-center',
    'ange-celeste': 'object-cover object-[center_28%]',
    'steven-shimirwa': 'object-cover object-[center_22%]',
    'patience-hirwa': 'object-cover object-center',
    'faustin-nzitonda': 'object-cover object-center',
    'cybille-ishimwe': 'object-cover object-center',
    'joseph-karemera': 'object-cover object-[center_58%]',
    'emmanuel-muridwa': 'object-cover object-[center_22%]',
    'saiba-ramadhan': 'object-cover object-[center_20%]',
    'jules-kwizera': 'object-cover object-[center_12%]',
};

export function memberImageClass(slug: string, fallback = 'object-cover object-center') {
    return MEMBER_IMAGE_FOCUS[slug] ?? fallback;
}
