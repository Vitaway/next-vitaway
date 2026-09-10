export type OfferingFaq = {
    question: string;
    answer: string;
};

export type OfferingSection = {
    title: string;
    body?: string;
    items?: { title: string; body: string }[];
    image?: string;
};

export type OfferingCta = {
    label: string;
    href?: string;
    action?: 'book' | 'whatsapp' | 'contact';
    variant?: 'primary' | 'secondary';
};

export type OfferingCard = {
    href: string;
    title: string;
    description: string;
    cta?: string;
        image: string;
};

export type OfferingPageContent = {
    slug: string;
    title: string;
    accentWord?: string;
    description: string;
    heroImage?: string;
    sections: OfferingSection[];
    faqs?: OfferingFaq[];
    ctas: OfferingCta[];
    related?: { href: string; label: string; description: string; image?: string }[];
};

export type OfferingHubContent = {
    title: string;
    accentWord?: string;
    description: string;
    heroImage?: string;
    cards: OfferingCard[];
    secondaryCards?: OfferingCard[];
    sections?: OfferingSection[];
    faqs?: OfferingFaq[];
    ctas: OfferingCta[];
};

export const individualsHub: OfferingHubContent = {
    title: 'Find out what is actually going on. Then fix it properly.',
    accentWord: 'properly',
    description:
        'Most people in Rwanda have never had their blood sugar or cholesterol measured. A Vitaway health check takes about an hour, and you leave knowing exactly where you stand and what to do about it.',
    heroImage: '/images/clinic/clinical-consultation.jpg',
    cards: [
        {
            href: '/for-individuals/health-check',
            title: 'Health Check',
            description:
                'Blood pressure, blood sugar, weight, waist, BMI — and a real conversation about your diet with a registered nutritionist.',
            cta: 'See what is measured',
            image: '/images/clinic/finger-prick-glucometer.jpg',
        },
        {
            href: '/for-individuals/12-week-programme',
            title: '12-Week Programme',
            description:
                'A structured plan built on Rwandan food, with someone checking on you the whole way — and a re-measurement at the end.',
            cta: 'How the twelve weeks run',
            image: '/images/clinic/diabetes-control-food.jpg',
        },
    ],
    secondaryCards: [
        {
            href: '/for-individuals/continued-care',
            title: 'Continued Care',
            description: 'Keep the gains after twelve weeks with regular reviews and quarterly re-measurement.',
            image: '/images/clinic/clinical-consultation.jpg',
        },
        {
            href: '/for-individuals/weight',
            title: 'Weight and metabolic health',
            description: 'When diets have failed and you need a plan, not another restriction list.',
            image: '/images/clinic/body-composition-scale.jpg',
        },
        {
            href: '/for-individuals/blood-pressure',
            title: 'Blood pressure',
            description: 'High readings that feel like nothing — and what actually helps.',
            image: '/images/clinic/clinical-consultation.jpg',
        },
        {
            href: '/for-individuals/blood-sugar',
            title: 'Blood sugar',
            description: 'You have been told your sugar is high. Here is what to do next.',
            image: '/images/clinic/glucose-meter-lifestyle.jpg',
        },
        {
            href: '/for-individuals/family',
            title: 'Family and child nutrition',
            description: 'Feeding a household well, on a real budget, with safeguarding in place.',
            image: '/images/clinic/family-breakfast.jpg',
        },
    ],
    sections: [
        {
            title: 'What a first visit is actually like',
            image: '/images/clinic/clinic-exterior.jpg',
                body: 'You book online, on WhatsApp, or by phone. You come in for about an hour. You leave with your numbers written down and a clear recommendation — including whether the twelve-week programme makes sense for you.',
        },
    ],
    faqs: [
        {
            question: 'Do I need a referral from a doctor?',
            answer:
                'No. You can book directly. If we find something that needs a doctor, we tell you and refer you.',
        },
        {
            question: 'Should I eat before I come?',
            answer:
                'For a blood sugar reading it helps to come fasted, so book a morning slot if you can. If that is not possible, come anyway — we will tell you what the number means either way.',
        },
        {
            question: 'How do I pay?',
            answer:
                'Ask us when you book — we will confirm payment methods and whether your insurance can be used.',
        },
        {
            question: 'Can you help if I am already on medication?',
            answer:
                "Yes. We work alongside your treatment. We do not change or stop anyone's medication — that is your doctor's decision.",
        },
    ],
    ctas: [
        { label: 'Book a health check', action: 'book' },
        { label: 'Message us on WhatsApp', action: 'whatsapp', variant: 'secondary' },
    ],
};

export const organizationsHub: OfferingHubContent = {
    title: 'Your wellness budget should produce a report, not a memory of a talk.',
    accentWord: 'report',
    description:
        'Vitaway screens your staff, tells you what we found without naming anyone, and runs a twelve-week clinical nutrition programme for the people who need one. Licensed by the Ministry of Health, delivered by registered nutritionists and nurses.',
    heroImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    cards: [
        {
            href: '/for-organizations/companies',
            title: 'Companies',
            description: 'Screening, a programme, and a report you can put in front of your board.',
            cta: 'See company programmes',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        },
        {
            href: '/for-organizations/embassies',
            title: 'Embassies and missions',
            description: 'A licensed local partner your duty-of-care review will accept.',
            cta: 'See mission programmes',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        },
        {
            href: '/for-organizations/ngos',
            title: 'NGOs',
            description: 'Staff wellbeing you can evidence, not just fund.',
            cta: 'See NGO programmes',
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
        },
        {
            href: '/for-organizations/schools',
            title: 'Schools',
            description: 'Two health programmes in one school: pupils and the adults who look after them.',
            cta: 'See school programmes',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
        },
    ],
    sections: [
        {
            title: 'Scope, screen, programme, report',
            items: [
                {
                    title: 'FIND',
                    body: 'Screen staff on site or at the clinic. Capture the numbers that matter.',
                },
                {
                    title: 'FOCUS',
                    body: 'A twelve-week clinical nutrition programme for the people the screening flagged — typically 15–30% of those screened.',
                },
                {
                    title: 'PROVE',
                    body: 'A written report on participation, findings, and what changed. Always included.',
                },
            ],
        },
        {
            title: 'You will never see an individual’s results',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
                body: 'We never share an individual’s results with an employer, school, or insurer. Reports are aggregated with a minimum group size so no one can be identified.',
        },
        {
            title: 'How a programme starts',
                image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
                body: 'We scope headcount, sites, and who joins the programme. After a twenty-minute call you get a written proposal.',
        },
    ],
    ctas: [
        { label: 'Contact us about a programme', action: 'contact' },
        { label: 'Message us on WhatsApp', action: 'whatsapp', variant: 'secondary' },
    ],
};

export const individualPages: Record<string, OfferingPageContent> = {
    'health-check': {
        slug: 'health-check',
        title: 'A proper health check, in about an hour',
        accentWord: 'hour',
        description:
            'Blood pressure, blood sugar, weight, waist, BMI — and a real conversation about your diet with a registered nutritionist. You leave with the numbers written down and a clear recommendation.',
        heroImage: '/images/clinic/finger-prick-glucometer.jpg',
        sections: [
            {
                title: 'What is measured',
                items: [
                    { title: 'Blood pressure', body: 'Taken properly, explained in plain language.' },
                    { title: 'Blood sugar', body: 'Context for fasting vs non-fasting readings.' },
                    { title: 'Weight, waist, BMI', body: 'Numbers that matter for metabolic risk — not vanity metrics.' },
                    {
                        title: 'Diet conversation',
                        body: 'What you actually eat in a Rwandan week, and what to change first.',
                    },
                ],
            },
            {
                title: 'What you leave with',
                image: '/images/clinic/finger-prick-swab.jpg',
                body: 'Your numbers written down, a clear recommendation, and a next step — including whether the twelve-week programme makes sense.',
            },
            {
                title: 'What this is not',
                image: '/images/clinic/clinical-consultation.jpg',
                body: 'It is not a full medical workup, not a lab panel for everything, and not a lecture. If something needs a doctor, we say so and refer you.',
            },
        ],
        faqs: [
            {
                question: 'Should I eat before I come?',
                answer:
                    'For a blood sugar reading it helps to come fasted, so book a morning slot if you can. If that is not possible, come anyway — we will tell you what the number means either way.',
            },
            {
                question: 'Do I need a referral?',
                answer: 'No. You can book directly.',
            },
            {
                question: 'Can insurance cover this?',
                answer:
                    'Ask us when you book. Coverage depends on your scheme; we will tell you what we can invoice and what is paid at the clinic.',
            },
        ],
        ctas: [
            { label: 'Book a health check', action: 'book' },
            { label: 'WhatsApp', action: 'whatsapp', variant: 'secondary' },
        ],
        related: [
            {
                href: '/for-individuals/12-week-programme',
                label: '12-Week Programme',
                description: 'If the check shows you need structured follow-through.',
                image: '/images/clinic/diabetes-control-food.jpg',
            },
        ],
    },
    '12-week-programme': {
        slug: '12-week-programme',
        title: 'Twelve weeks. A plan built on Rwandan food. Someone checking on you the whole way.',
        accentWord: 'Rwandan food',
        description:
            'Most nutrition advice fails because it stops at advice. This is a programme with a structure and an end date — and at the end we measure you again and compare it to week one.',
        heroImage: '/images/clinic/diabetes-control-food.jpg',
        sections: [
            {
                title: 'How the twelve weeks run',
                items: [
                    { title: 'Assessment', body: 'We start from your numbers and your real food week.' },
                    { title: 'Your plan', body: 'Built on foods you can buy here — not imported fantasy lists.' },
                    { title: 'The work', body: 'Check-ins, adjustments, and accountability across the twelve weeks.' },
                    { title: 'Re-measurement', body: 'We measure again and compare to week one.' },
                    { title: 'Your choice', body: 'Continue with care, or leave with a clear exit plan.' },
                ],
            },
            {
                title: 'Who it is for',
                image: '/images/clinic/waist-measure-success.jpg',
                body: 'People with raised sugar, pressure, weight, or cholesterol who want a structured path — not one session and a printout.',
            },
            {
                title: 'What this is not',
                image: '/images/clinic/clinical-consultation.jpg',
                body: 'Not a subscription that quietly renews. Not a gym membership. Not medication management — we work alongside your doctor.',
            },
        ],
        faqs: [
            {
                question: 'Do I have to use the app?',
                answer:
                    'The app helps with reminders and check-ins, but the programme is led by your nutritionist. We will not leave you stuck behind a login.',
            },
            {
                question: 'What if I miss a consultation?',
                answer: 'Tell us early. We reschedule within the twelve-week window whenever we can.',
            },
            {
                question: 'Will you change my medication?',
                answer: "No. Medication decisions stay with your doctor. We work alongside treatment.",
            },
        ],
        ctas: [
            { label: 'Start the programme', action: 'book' },
            {
                label: 'Not sure? Book a health check first',
                href: '/for-individuals/health-check',
                variant: 'secondary',
            },
        ],
    },
    'continued-care': {
        slug: 'continued-care',
        title: 'The hard part is keeping it',
        accentWord: 'keeping it',
        description:
            'For people who have completed the twelve weeks. Regular reviews with your nutritionist, adjustments when life changes, and a full re-measurement every three months.',
        heroImage: '/images/clinic/waist-measure-success.jpg',
        sections: [
            {
                title: 'What continued care includes',
                items: [
                    { title: 'Regular reviews', body: 'Scheduled time with your nutritionist, not a silent app feed.' },
                    { title: 'Life adjustments', body: 'Travel, work stress, family meals — we adjust the plan when reality shifts.' },
                    {
                        title: 'Quarterly re-measurement',
                        body: 'Full numbers again every three months so you can see what is holding and what is slipping.',
                    },
                ],
            },
        ],
        faqs: [
            {
                question: 'Do I need to finish the twelve weeks first?',
                answer: 'Yes. Continued Care is designed for people who have completed the programme.',
            },
            {
                question: 'Can I cancel?',
                answer: 'Yes. It is monthly and you can cancel any time.',
            },
        ],
        ctas: [
            { label: 'Continue with Vitaway', action: 'book' },
            { label: 'See the twelve-week programme', href: '/for-individuals/12-week-programme', variant: 'secondary' },
        ],
    },
    weight: {
        slug: 'weight',
        title: 'Losing weight when nothing has worked before',
        accentWord: 'nothing',
        description:
            'Almost one adult in five in Rwanda now carries excess weight. Most have tried something already, and most of what is available is a diet rather than a plan.',
        heroImage: '/images/clinic/body-composition-scale.jpg',
        sections: [
            {
                title: 'The weight is usually not the first problem',
                image: '/images/clinic/waist-measure-success.jpg',
                body: 'We measure sugar, pressure, waist, and diet patterns first. The plan targets what is driving the weight — not a one-week purge.',
            },
            {
                title: 'What we would actually do',
                items: [
                    { title: 'Measure', body: 'A proper health check so we know what we are working with.' },
                    { title: 'Plan', body: 'Food you can buy and cook here, sized to your life.' },
                    { title: 'Follow through', body: 'Twelve weeks of structure if you need it — then continued care if you want to keep it.' },
                ],
            },
            {
                title: 'What nutrition can and cannot do',
                image: '/images/clinic/body-composition-scale.jpg',
                body: 'Nutrition can change trajectory. It cannot replace medical care for conditions that need a doctor. We say clearly where our lane ends.',
            },
        ],
        faqs: [
            {
                question: 'Will you put me on a diet?',
                answer: 'No. We build a plan around Rwandan food and your week — not a temporary restriction list.',
            },
            {
                question: 'Do I need to join a gym?',
                answer: 'Not required. Movement helps; we will be honest about what is enough for your goals.',
            },
            {
                question: 'What if I do not lose weight?',
                answer:
                    'We re-measure and look at metabolic markers, not only the scale. If the plan is not working, we change it.',
            },
        ],
        ctas: [{ label: 'Book a health check', action: 'book' }],
    },
    'blood-pressure': {
        slug: 'blood-pressure',
        title: 'Your blood pressure is high. What actually helps?',
        accentWord: 'actually helps',
        description:
            'One adult in six in Rwanda has raised blood pressure, and nine in ten of them are not being treated for it. Most feel completely fine.',
        heroImage: '/images/clinic/clinical-consultation.jpg',
        sections: [
            {
                title: 'The dangerous part is that it does not feel like anything',
                image: '/images/clinic/finger-prick-swab.jpg',
                body: 'We measure carefully, explain the reading, and build a nutrition plan that supports blood pressure — alongside whatever your doctor has prescribed.',
            },
            {
                title: 'What we would actually do',
                items: [
                    { title: 'Confirm the numbers', body: 'Proper measurement and context, not a single scary reading in isolation.' },
                    { title: 'Salt and food reality', body: 'Where salt actually comes from in a Rwandan kitchen and what to change first.' },
                    { title: 'Follow-through', body: 'A structured programme when one visit is not enough.' },
                ],
            },
        ],
        faqs: [
            {
                question: 'Where does the salt actually come from?',
                answer:
                    'Often from stock cubes, processed snacks, and restaurant food — not only the salt shaker. We map your week and pick the highest-impact changes.',
            },
            {
                question: 'Do I have to stop drinking?',
                answer: 'Not always. We will be specific about your numbers and what alcohol is doing for you.',
            },
            {
                question: 'What if my reading is very high on the day?',
                answer: 'We treat that seriously, explain what it means, and refer urgently when needed.',
            },
        ],
        ctas: [{ label: 'Book a health check', action: 'book' }],
    },
    'blood-sugar': {
        slug: 'blood-sugar',
        title: 'You have been told your blood sugar is high. Now what?',
        accentWord: 'Now what',
        description:
            'Almost nine in ten Rwandan adults have never had their blood sugar measured — so for most people this news arrives suddenly, with no explanation of what to do next.',
        heroImage: '/images/clinic/glucose-meter-lifestyle.jpg',
        sections: [
            {
                title: 'Two things are usually true at once',
                image: '/images/clinic/diabetes-control-food.jpg',
                body: 'You need clear numbers and a practical food plan — and you may also need a doctor. We handle the nutrition lane and refer when medical care is required.',
            },
            {
                title: 'What we would actually do',
                items: [
                    { title: 'Measure and explain', body: 'Fasting context, what the reading means, and what to watch next.' },
                    { title: 'Food you already know', body: 'Including staples like ubugali — adjusted, not banned by default.' },
                    { title: 'Structured follow-up', body: 'Twelve weeks when advice alone will not move the needle.' },
                ],
            },
        ],
        faqs: [
            {
                question: 'Can I still eat ubugali?',
                answer: 'Usually yes, with portion and pairing guidance. We do not start by deleting your plate.',
            },
            {
                question: 'Will you tell me to stop my medicine?',
                answer: 'Never. Medication stays with your doctor.',
            },
            {
                question: 'How quickly would I see a change?',
                answer: 'Some markers move in weeks; others take longer. We re-measure so you are not guessing.',
            },
        ],
        ctas: [{ label: 'Book a health check', action: 'book' }],
    },
    family: {
        slug: 'family',
        title: 'Feeding a family well, on a real budget',
        accentWord: 'real budget',
        description:
            'Nearly nine in ten Rwandan adults eat fewer than five servings of fruit and vegetables a day. Feeding a household well is a planning and money problem before it is a knowledge problem.',
        heroImage: '/images/clinic/family-breakfast.jpg',
        sections: [
            {
                title: 'Children are seen with a parent, always',
                image: '/images/clinic/family-breakfast.jpg',
                body: 'Safeguarding comes first. Children are seen with a parent or guardian. Results are handled carefully and explained to the adult responsible.',
            },
            {
                title: 'What we would actually do',
                items: [
                    { title: 'Household plan', body: 'Meals that fit budget, market access, and school schedules.' },
                    { title: 'Child growth context', body: 'Weight and nutrition conversations that protect dignity.' },
                    { title: 'Parent check-ins', body: 'Adult health checks when the household plan needs the caregiver well too.' },
                ],
            },
        ],
        faqs: [
            {
                question: 'Will my child be weighed in front of other people?',
                answer: 'No. Child measurements are private.',
            },
            {
                question: "Who sees my child's results?",
                answer: 'The parent or guardian with the child. We do not share child results with schools or employers.',
            },
            {
                question: 'My child is a very fussy eater. Is that a nutrition problem?',
                answer:
                    'Sometimes it is developmental preference, sometimes it is a nutrition risk. We assess carefully and avoid shame-based advice.',
            },
        ],
        ctas: [{ label: 'Book a health check', action: 'book' }],
    },
};

const orgSharedSections: OfferingSection[] = [
    {
        title: 'Scope, screen, programme, report',
        items: [
            { title: 'FIND', body: 'Screen your people. Capture the numbers that matter.' },
            {
                title: 'FOCUS',
                body: 'A twelve-week clinical nutrition programme for those flagged — typically 15–30% of those screened.',
            },
            {
                title: 'PROVE',
                body: 'A written report on participation, findings, and what changed. Always included.',
            },
        ],
    },
    {
        title: 'You will never see an individual’s results',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
                body: 'Reports are aggregated. We do not share named individual results with an employer, school, or insurer.',
    },
    {
        title: 'How a programme starts',
                image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
                body: 'We scope headcount, sites, and programme uptake. After a twenty-minute call you get a written proposal.',
    },
];

export const organizationPages: Record<string, OfferingPageContent> = {
    companies: {
        slug: 'companies',
        title: 'Screening, a programme, and a report you can put in front of your board.',
        accentWord: 'board',
        description:
            'Most workplace wellness in Rwanda is a talk and a fruit basket. This is a licensed clinical service that measures your staff, treats the nutrition side of what it finds, and writes down what changed.',
        heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        sections: [
            {
                title: 'On any given morning, in any office in Kigali',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                body: 'People are working with undiagnosed raised sugar and pressure. Screening finds it. The programme does something about it. The report proves what happened.',
            },
            ...orgSharedSections,
            {
                title: 'How it runs in a company',
                image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
                body: 'Screening on site or at the clinic, leadership communication that protects privacy, and a programme that mostly runs outside core working hours.',
            },
        ],
        faqs: [
            {
                question: 'How much staff time does this take?',
                answer:
                    'About twenty minutes per person for screening. The twelve-week programme runs mostly outside working hours, with limited check-ins that teams can schedule.',
            },
            {
                question: 'What if hardly anyone takes part?',
                answer:
                    'Participation is the number we care about most. Leadership visibility, a clear privacy statement, and screening on paid time are what move uptake.',
            },
            {
                question: 'Can we do it for one department first?',
                answer: 'Yes, and often you should. A pilot department produces a cleaner report and a clearer board conversation.',
            },
            {
                question: 'Do you replace our medical insurance?',
                answer: 'No. We sit alongside it. We refer into clinical care when nutrition is not enough.',
            },
            {
                question: 'How do we get a proposal?',
                answer:
                    'Tell us your headcount, sites, and goals. After a twenty-minute call you get a written proposal.',
            },
        ],
        ctas: [
            { label: 'Contact us about a programme', action: 'contact' },
            { label: 'Message us on WhatsApp', action: 'whatsapp', variant: 'secondary' },
        ],
    },
    embassies: {
        slug: 'embassies',
        title: 'A licensed local partner your duty-of-care review will accept.',
        accentWord: 'licensed',
        description:
            'Health screening and clinical nutrition programmes for locally engaged and posted staff, delivered by a Ministry of Health–licensed Rwandan clinic, documented to a standard your procurement and health-and-safety processes can review.',
        heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
        sections: [
            {
                title: 'Two staff populations, one standard',
                image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
                body: 'Locally engaged and posted staff can be served on the same clinical terms, with documentation your mission can file.',
            },
            ...orgSharedSections,
            {
                title: 'Procurement pack',
                image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
                body: 'Licence details, clinical scope, confidentiality rules, and escalation pathways — ready for review.',
            },
        ],
        faqs: [
            {
                question: 'Who exactly are we contracting with?',
                answer: 'Vitaway Health Ltd, a Ministry of Health–licensed clinical nutrition company in Kigali.',
            },
            {
                question: 'Where is staff health data stored, and under what law?',
                answer:
                    'Clinical data stays under Vitaway’s clinical confidentiality rules and applicable Rwandan data protection requirements. Aggregate reports to the mission never name individuals.',
            },
            {
                question: 'Can you serve both staff groups on the same terms?',
                answer: 'Yes. One clinical standard, documented clearly for both groups.',
            },
            {
                question: 'What if someone needs care beyond nutrition?',
                answer: 'We refer. Nutrition is our lane; we do not pretend otherwise.',
            },
        ],
        ctas: [
            { label: 'Contact us about a programme', action: 'contact' },
            { label: 'Licence and standards', href: '/customer-support', variant: 'secondary' },
        ],
    },
    ngos: {
        slug: 'ngos',
        title: 'Staff wellbeing you can evidence, not just fund.',
        accentWord: 'evidence',
        description:
            'Screening and clinical nutrition programmes for Kigali-based and field staff, with a written report designed to be quotable in your board pack or donor reporting — and no individual ever named.',
        heroImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80',
        sections: [
            {
                title: 'The organisations that work on health are often the last to check their own staff',
                image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
                body: 'We run the same FIND / FOCUS / PROVE method for NGO teams, with reporting language that fits board and donor packs.',
            },
            ...orgSharedSections,
        ],
        faqs: [
            {
                question: 'Can we report this to a donor?',
                answer:
                    'Yes — using aggregate participation and outcome figures from the PROVE-style report, never named individuals.',
            },
            {
                question: 'Does this cover field staff outside Kigali?',
                answer:
                    'Often yes with planning. Tell us where staff sit; we will say what we can run on site versus what needs travel to Kigali.',
            },
            {
                question: 'Is this a health programme for our beneficiaries?',
                answer:
                    'This page is for staff wellbeing. Beneficiary programmes are a different conversation — ask us and we will route you correctly.',
            },
        ],
        ctas: [
            { label: 'Contact us about a programme', action: 'contact' },
            { label: 'Message us on WhatsApp', action: 'whatsapp', variant: 'secondary' },
        ],
    },
    schools: {
        slug: 'schools',
        title: 'Two health programmes in one school: one for pupils, one for the adults who look after them.',
        accentWord: 'two',
        description:
            'Nutrition screening and education for pupils, with parental consent and safeguarding in place — and the same licensed health check every other organisation buys, for your teaching and support staff.',
        heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
        sections: [
            {
                title: 'Safeguarding, before anything commercial',
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
                body: 'Children are seen with a parent or guardian framework in place. Results are handled carefully. Staff programmes follow the same privacy rules as any employer.',
            },
            {
                title: 'Why schools ask us in',
                image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
                body: 'Pupil nutrition concerns and staff chronic-disease risk often arrive together. We can run one, the other, or both.',
            },
            ...orgSharedSections,
        ],
        faqs: [
            {
                question: 'How do you handle a child who is underweight, or overweight?',
                answer:
                    'Privately, with the parent or guardian, without shaming. We explain findings and next steps carefully.',
            },
            {
                question: 'What do we tell parents?',
                answer:
                    'We help the school communicate purpose, consent, and privacy before any screening day.',
            },
            {
                question: 'Can we do the staff programme only?',
                answer: 'Yes.',
            },
            {
                question: 'When can this happen?',
                answer: 'Around the school calendar — exam periods and holidays included in the planning conversation.',
            },
        ],
        ctas: [
            { label: 'Contact us about a programme', action: 'contact' },
            { label: 'Safeguarding and standards', href: '/customer-support', variant: 'secondary' },
        ],
    },
};
