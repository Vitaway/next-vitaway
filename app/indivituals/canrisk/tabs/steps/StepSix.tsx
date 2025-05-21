import React, { useState } from 'react';

function StepSix({ onInputChange }: { onInputChange: (data: { waist: string }) => void }) {
    const [waist, setWaist] = useState('');

    const handleWaistChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newWaist = event.target.value;
        setWaist(newWaist);
        onInputChange({ waist: newWaist });
    };

    return (
        <section id="waist-content">
            <h2 tabIndex={-1}>What is your waist circumference?</h2>
            <p>To help you calculate this, use a tape measure; place it around your waist at the level of your belly button. Breathe out. Do not hold your breath, then measure.</p>
            <p>Use the slider on the ruler below which will indicate the appropriate number.</p>
            <p>You can also enter the information by typing it in the box.</p>

            <div className="waist-outer">
                <div className="waist-modern-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
                    <div className="waist-input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <label htmlFor="waistInput" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            Enter your waist size <span className="wb-inv">in inches</span>
                        </label>
                        <input
                            type="text"
                            name="waistInput"
                            id="waistInput"
                            className="form-control"
                            placeholder="Ex: 101cm or 40 in"
                            value={waist}
                            onChange={handleWaistChange}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1.5px solid #a0aec0',
                                fontSize: '1.1rem',
                                width: '220px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div className="waist-slider-group" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label htmlFor="waistRange" className="sr-only">
                            <span>Use the slider to select your waist size or type it in the box above</span>
                        </label>
                        <input
                            data-initial="1"
                            type="range"
                            id="waistRange"
                            min="50.8"
                            max="203.2"
                            value={parseFloat(waist) || 50.8}
                            onChange={(e) => handleWaistChange({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                            style={{
                                width: '100%',
                                accentColor: '#3182ce',
                                height: '6px',
                                borderRadius: '3px',
                                background: 'linear-gradient(90deg, #63b3ed 0%, #3182ce 100%)',
                                marginBottom: '0.5rem'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.95rem', color: '#4a5568' }}>
                            <span>51cm / 20 in</span>
                            <span>203cm / 80 in</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Body fat stored around the abdomen (rather than the hips and thighs) is a risk factor for developing type 2 diabetes.
            </div>
        </section>
    );
}

export default StepSix;