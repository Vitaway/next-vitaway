/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import React, { useState } from 'react';

function StepNine({ onInputChange }: { onInputChange: (data: { bloodSugar: string[] }) => void }) {
    const [bloodSugar, setBloodSugar] = useState<string[]>([]);

    const handleBloodSugarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        let updatedBloodSugar;
        if (isChecked) {
            updatedBloodSugar = [...bloodSugar, value];
        } else {
            updatedBloodSugar = bloodSugar.filter((item) => item !== value);
        }

        setBloodSugar(updatedBloodSugar);
        onInputChange({ bloodSugar: updatedBloodSugar });
    };

    return (
        <section id="blood-sugar-content">
            <h2 tabIndex={-1}>Have you ever been found to have high blood sugar?</h2>
            <p>Choose all that apply</p>

            <fieldset>
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/lady.jpg" alt="" />

                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="bloodSugar[]"
                            value="From a blood test"
                            checked={bloodSugar.includes('From a blood test')}
                            onChange={handleBloodSugarChange}
                        />
                        &nbsp;From a blood test
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="bloodSugar[]"
                            value="During an illness"
                            checked={bloodSugar.includes('During an illness')}
                            onChange={handleBloodSugarChange}
                        />
                        &nbsp;During an illness
                    </label>
                </div>
                <div className="checkbox" data-exclude-gender="6">
                    <label>
                        <input
                            type="checkbox"
                            name="bloodSugar[]"
                            value="During pregnancy (gestational diabetes)"
                            checked={bloodSugar.includes('During pregnancy (gestational diabetes)')}
                            onChange={handleBloodSugarChange}
                        />
                        &nbsp;During pregnancy (gestational diabetes)
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="bloodSugar[]"
                            value="No"
                            checked={bloodSugar.includes('No')}
                            onChange={handleBloodSugarChange}
                        />
                        &nbsp;No
                    </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="bloodSugar[]"
                            value="Don't know"
                            checked={bloodSugar.includes("Don't know")}
                            onChange={handleBloodSugarChange}
                        />
                        &nbsp;Don't know
                    </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                A previous test result indicating abnormally high blood sugar may indicate temporary metabolic problems or pre-diabetes. An unusually high blood sugar may be a warning sign that you are at high risk of developing full-blown diabetes in the future. Women who have had gestational diabetes (high blood sugar during pregnancy) are at higher risk of developing type 2 diabetes later in life.
            </div>
        </section>
    );
}

export default StepNine;