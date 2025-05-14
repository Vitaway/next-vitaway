import Image from 'next/image'
import React, { useState } from 'react';

function StepEleven({ onInputChange }: { onInputChange: (data: { relatives: string[] }) => void }) {
    const [relatives, setRelatives] = useState<string[]>([]);

    const handleRelativesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        let updatedRelatives;
        if (isChecked) {
            updatedRelatives = [...relatives, value];
        } else {
            updatedRelatives = relatives.filter((item) => item !== value);
        }

        setRelatives(updatedRelatives);
        onInputChange({ relatives: updatedRelatives });
    };

    return (
        <section id="family-content">
            <h2 tabIndex={-1}>Have any of your blood relatives ever been diagnosed with diabetes?</h2>
            <p>Choose all that apply</p>
            <fieldset>
                <Image
                    width={500}
                    height={500}
                    src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/mother-and-daughter.jpg"
                    alt="Photo of a mother and her adult daughter"
                />
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="relatives[]"
                            value="Mother"
                            checked={relatives.includes('Mother')}
                            onChange={handleRelativesChange}
                        />
                        &nbsp;Mother
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="relatives[]"
                            value="Father"
                            checked={relatives.includes('Father')}
                            onChange={handleRelativesChange}
                        />
                        &nbsp;Father
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="relatives[]"
                            value="Brother(s)/Sister(s)"
                            checked={relatives.includes('Brother(s)/Sister(s)')}
                            onChange={handleRelativesChange}
                        />
                        &nbsp;Brother(s)/Sister(s)
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="relatives[]"
                            value="Children"
                            checked={relatives.includes('Children')}
                            onChange={handleRelativesChange}
                        />
                        &nbsp;Children
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="relatives[]"
                            value="Other"
                            checked={relatives.includes('Other')}
                            onChange={handleRelativesChange}
                        />
                        &nbsp;Other
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="relatives[]"
                            value="No"
                            checked={relatives.includes('No')}
                            onChange={handleRelativesChange}
                        />
                        &nbsp;No, I have no blood relatives diagnosed with diabetes
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="relatives[]"
                            value="I do not know"
                            checked={relatives.includes('I do not know')}
                            onChange={handleRelativesChange}
                        />
                        &nbsp;I do not know
                    </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Families not only share genes which influence diabetes risk, but also shared culture and lifestyle (e.g. eating together at the same table).
            </div>
        </section>
    );
}

export default StepEleven;