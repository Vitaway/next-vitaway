import Image from 'next/image'
import React, { useState } from 'react';

function StepTen({ onInputChange }: { onInputChange: (data: { pregnancy: string }) => void }) {
    const [pregnancy, setPregnancy] = useState('');

    const handlePregnancyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPregnancy = event.target.value;
        setPregnancy(newPregnancy);
        onInputChange({ pregnancy: newPregnancy });
    };

    return (
        <section id="pregnancy-content" data-exclude-gender="6">
            <h2 tabIndex={-1}>Have you ever given birth to a baby weighing 9 pounds (4.1 kg) or more?</h2>

            <fieldset>
                <Image
                    width={500}
                    height={500}
                    src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/mother-and-child.jpg"
                    alt="Photo of a mother and her young child"
                />

                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="pregnancyRadio"
                            id="pregnancyRadioYes"
                            value="Yes"
                            checked={pregnancy === 'Yes'}
                            onChange={handlePregnancyChange}
                        />
                        Yes, I have given birth to a baby weighing 9 pounds (4.1 kg) or more
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="pregnancyRadio"
                            id="pregnancyRadioNo"
                            value="No"
                            checked={pregnancy === 'No'}
                            onChange={handlePregnancyChange}
                        />
                        No, I have not given birth to a baby weighing 9 pounds (4.1 kg) or more
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="pregnancyRadio"
                            id="pregnancyRadioDontKnow"
                            value="I do not know"
                            checked={pregnancy === 'I do not know'}
                            onChange={handlePregnancyChange}
                        />
                        I do not know
                    </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>

            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Giving birth to a large infant over 9 pounds (4.1 kg) is related to high maternal weight gain during pregnancy and/or gestational diabetes.
            </div>
        </section>
    );
}

export default StepTen;