/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import React, { useState } from 'react';

function StepEight({ onInputChange }: { onInputChange: (data: { bloodPressure: string; bloodPressurePills: string }) => void }) {
    const [bloodPressure, setBloodPressure] = useState('');
    const [bloodPressurePills, setBloodPressurePills] = useState('');

    const handleBloodPressureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newBloodPressure = event.target.value;
        setBloodPressure(newBloodPressure);
        onInputChange({ bloodPressure: newBloodPressure, bloodPressurePills });
    };

    const handleBloodPressurePillsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newBloodPressurePills = event.target.value;
        setBloodPressurePills(newBloodPressurePills);
        onInputChange({ bloodPressure, bloodPressurePills: newBloodPressurePills });
    };

    return (
        <section id="blood-pressure-content">
            <h2 tabIndex={-1}>Have you ever been told by a doctor or nurse that you have high blood pressure?</h2>
            <p>* If you are not certain about the answer, select <strong>"No"</strong>.</p>

            <fieldset>
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/senior-couple.jpg" alt="Photo of a elderly couple" />
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="bloodPressure"
                            id="bloodPressureYes"
                            value="Yes"
                            checked={bloodPressure === 'Yes'}
                            onChange={handleBloodPressureChange}
                        />
                        Yes, I have been told by a doctor or nurse that I have high blood pressure
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="bloodPressure"
                            id="bloodPressureNo"
                            value="No"
                            checked={bloodPressure === 'No'}
                            onChange={handleBloodPressureChange}
                        />
                        No, I have not been told by a doctor or nurse that I have high blood pressure
                    </label>
                </div>
            </fieldset>

            <h2>Have you ever taken high blood pressure pills?</h2>
            <p>* If you are not certain about the answer, select <strong>"No"</strong>.</p>
            <fieldset>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="bloodPressurePills"
                            id="bloodPressurePillsYes"
                            value="Yes"
                            checked={bloodPressurePills === 'Yes'}
                            onChange={handleBloodPressurePillsChange}
                        />
                        Yes, I have taken high blood pressure pills
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="bloodPressurePills"
                            id="bloodPressurePillsNo"
                            value="No"
                            checked={bloodPressurePills === 'No'}
                            onChange={handleBloodPressurePillsChange}
                        />
                        No, I have not taken high blood pressure pills
                    </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Diabetes and high blood pressure are often found together. You can decrease your risk of high blood pressure by increasing physical activity, reducing salt and fat in your diet, limiting alcohol consumption, avoiding tobacco use, reducing stress, and maintaining a healthy body weight. Many people with undiagnosed type 2 diabetes have high blood pressure. Good control of blood pressure can substantially reduce your risk of developing complications.
            </div>
        </section>
    );
}

export default StepEight;