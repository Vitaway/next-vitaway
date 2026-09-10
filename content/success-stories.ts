export type SuccessStory = {
    quote: string;
    name: string;
    role: string;
    image: string;
    programme?: string;
};

export const featuredSuccessStory: SuccessStory = {
    quote: 'The nutrition plan was simple enough to cook after work. My numbers actually moved.',
    name: 'Emmanuel',
    role: 'Diabetes programme · Kigali',
    programme: '12-Week Programme',
    image: '/images/clinic/waist-measure-success.jpg',
};

export const successStories: SuccessStory[] = [
    {
        quote: 'We finally had a clinician the same day. No waiting room, no guessing.',
        name: 'Noela',
        role: 'Vitaway member, Kigali',
        programme: 'Health Check',
        image: '/images/clinic/finger-prick-glucometer.jpg',
    },
    {
        quote: 'Booking a consult for my family took minutes. It feels like care that respects our time.',
        name: 'Eric',
        role: 'Vitaway member',
        programme: 'Family nutrition',
        image: '/images/clinic/family-breakfast.jpg',
    },
    {
        quote: 'Our staff screening produced a report the board could read — without naming anyone.',
        name: 'Diane',
        role: 'HR lead, Kigali company',
        programme: 'Company programme',
        image: '/images/clinic/clinical-consultation.jpg',
    },
    {
        quote: 'I came in with high pressure that felt like nothing. Twelve weeks later the reading was different.',
        name: 'Jean',
        role: 'Continued Care member',
        programme: 'Blood pressure',
        image: '/images/clinic/finger-prick-swab.jpg',
    },
    {
        quote: 'They built the plan on food I already buy at the market. That is why I stuck with it.',
        name: 'Clarisse',
        role: 'Weight programme · Niboye',
        programme: 'Weight and metabolic health',
        image: '/images/clinic/body-composition-scale.jpg',
    },
    {
        quote: 'My child was seen with me in the room. Results stayed private. That mattered.',
        name: 'Aline',
        role: 'Parent, Kicukiro',
        programme: 'Family and child nutrition',
        image: '/images/clinic/diabetes-control-food.jpg',
    },
];
