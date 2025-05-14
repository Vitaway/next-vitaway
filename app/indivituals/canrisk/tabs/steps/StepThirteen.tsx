/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';

function StepThirteen({ onInputChange, onComplete }: { onInputChange: (data: { education: string }) => void, onComplete: () => void }) {
    const [education, setEducation] = useState<string>('');

    const handleEducationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedEducation = event.target.value;
        setEducation(selectedEducation);
        onInputChange({ education: selectedEducation });
    };

    const handleComplete = () => {
        onComplete();
    };

    return (
        <section id="education-content">
            <h2 tabIndex={-1}>What is the highest level of education you have completed?</h2>

            <fieldset>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="education"
                            value="5"
                            checked={education === '5'}
                            onChange={handleEducationChange}
                        />
                        Some high school or less
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="education"
                            value="1"
                            checked={education === '1'}
                            onChange={handleEducationChange}
                        />
                        High school
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="education"
                            value="0"
                            checked={education === '0'}
                            onChange={handleEducationChange}
                        />
                        Some college or university
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="education"
                            value="0"
                            checked={education === '0'}
                            onChange={handleEducationChange}
                        />
                        College/University degree
                    </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>How education relates to healthy living?</h3>
                <ul>
                    <li>An individual's health status improves with level of education.</li>
                    <li>Education improves people's ability to access and understand information to help keep them healthy.</li>
                    <li>Education is closely tied to socioeconomic status, and effective education for children and lifelong learning for adults are key contributors to health.</li>
                </ul>
            </div>

            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded" onClick={handleComplete}>
                Complete
            </button>
        </section>
    );
}

export default StepThirteen;