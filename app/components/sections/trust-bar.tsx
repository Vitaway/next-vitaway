import React from 'react';

const facts = [
    { title: 'Licensed', line: 'MoH L031072025 · TIN 119617446' },
    { title: 'Named clinicians', line: 'Every nutritionist listed' },
    { title: 'A real clinic', line: 'CPR-Unity House, Kicukiro' },
    { title: 'Your results stay yours', line: 'Never shared with an employer' },
];

function TrustBar() {
    return (
        <section className="border-y border-[#003E48]/8 bg-white">
            <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
                {facts.map((fact) => (
                    <div key={fact.title} className="border-[#003E48]/8 px-5 py-5 sm:px-8 lg:border-r lg:last:border-r-0">
                        <p className="text-sm font-semibold text-[#003E48]">{fact.title}</p>
                        <p className="mt-1 text-sm text-[#003E48]/70">{fact.line}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TrustBar;
