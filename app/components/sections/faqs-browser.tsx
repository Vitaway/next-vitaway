'use client';

import React, { useState } from 'react';
import FaqsCollapsable from './faqs-collapsable';

export type FaqCategory = {
    name: string;
    questions: { question: string; answer: string }[];
};

function FaqsBrowser({ categories }: { categories: FaqCategory[] }) {
    const [active, setActive] = useState(categories[0]?.name ?? '');
    const selected = categories.find((category) => category.name === active) ?? categories[0];

    if (!selected) return null;

    return (
        <div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
                {categories.map((category) => {
                    const isActive = category.name === selected.name;
                    return (
                        <button
                            key={category.name}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActive(category.name)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                isActive
                                    ? 'bg-[#E85A2E] text-white'
                                    : 'bg-white text-[#003E48] hover:bg-white/80'
                            }`}
                        >
                            {category.name}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8" role="tabpanel" aria-label={selected.name}>
                <FaqsCollapsable key={selected.name} faqs={selected.questions} />
            </div>
        </div>
    );
}

export default FaqsBrowser;
