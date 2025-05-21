import Image from 'next/image'
import React, { useState } from 'react';

function StepFour({ onInputChange }: { onInputChange: (data: { age: number }) => void }) {
    const [age, setAge] = useState<number>(50); // Default age is set to 50

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAge = parseInt(event.target.value, 10);
        setAge(newAge);
        onInputChange({ age: newAge });
    };

    const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAge = parseInt(event.target.value, 10);
        if (!isNaN(newAge) && newAge >= 25 && newAge <= 75) {
            setAge(newAge);
            onInputChange({ age: newAge });
        }
    };

    return (
        <section id="age-content">
            <h2 tabIndex={-1}>How old are you?</h2>
            <div className="info-box">
                To select your age on the ruler, click on the button and scroll left or right.
                <p>You can also enter your age by typing it in the box.</p>
            </div>

            <div id="age-inner" className="text-center">
                <Image
                    width={500}
                    height={500}
                    src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/age.jpg"
                    alt="Age illustration"
                />

                <div className="center-outer">
                    <div className="center-inner modern-age-input">
                        <div className="background text-center">
                            <div className="range-wrapper hidden-print">
                                <label htmlFor="ageRange" className="sr-only">
                                    <span>Use the slider to select your age or type it in the box below</span>
                                </label>
                                <input
                                    type="range"
                                    id="ageRange"
                                    min="25"
                                    max="75"
                                    value={age}
                                    onChange={handleSliderChange}
                                    className="modern-slider"
                                />
                                <div className="slider-labels">
                                    <span>25</span>
                                    <span>50</span>
                                    <span>75</span>
                                </div>
                            </div>
                            <div className="modern-age-box">
                                <label htmlFor="ageInput" className="modern-label">
                                    <span>Enter your age:</span>
                                </label>
                                <input
                                    type="text"
                                    size={3}
                                    maxLength={3}
                                    pattern="^\d{2,3}$"
                                    value={age}
                                    onChange={handleTextInputChange}
                                    name="ageInput"
                                    id="ageInput"
                                    className="modern-input"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <style jsx>{`
                            .modern-age-input {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                gap: 2rem;
                            }
                            .modern-slider {
                                width: 300px;
                                accent-color: #0078d4;
                                height: 6px;
                                border-radius: 3px;
                                margin-bottom: 0.5rem;
                            }
                            .slider-labels {
                                display: flex;
                                justify-content: space-between;
                                width: 300px;
                                font-size: 0.95rem;
                                color: #888;
                                margin-top: -0.5rem;
                            }
                            .modern-age-box {
                                display: flex;
                                align-items: center;
                                gap: 0.75rem;
                                background: #f5f7fa;
                                border-radius: 8px;
                                padding: 0.5rem 1rem;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            }
                            .modern-label {
                                font-weight: 500;
                                color: #333;
                            }
                            .modern-input {
                                width: 3rem;
                                font-size: 1.25rem;
                                padding: 0.25rem 0.5rem;
                                border: 1.5px solid #0078d4;
                                border-radius: 6px;
                                outline: none;
                                transition: border-color 0.2s;
                                text-align: center;
                                background: #fff;
                            }
                            .modern-input:focus {
                                border-color: #005fa3;
                                box-shadow: 0 0 0 2px #cce6ff;
                            }
                        `}</style>
                    </div>
                </div>
            </div>
            <div className="clearfix title-clear"></div>

            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                As you get older, your risk of developing diabetes goes up.
            </div>
        </section>
    );
}

export default StepFour;