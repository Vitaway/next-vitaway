import Image from 'next/image'
import React, { useState } from 'react';

function StepTwelve({ onInputChange }: { onInputChange: (data: { father: string; mother: string }) => void }) {
    const [father, setFather] = useState('');
    const [mother, setMother] = useState('');

    const handleFatherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFather = event.target.value;
        setFather(newFather);
        onInputChange({ father: newFather, mother });
    };

    const handleMotherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMother = event.target.value;
        setMother(newMother);
        onInputChange({ father, mother: newMother });
    };

    return (
        <section id="parents-content">
            <h2 tabIndex={-1}>Please select which of the following ethnic groups your biological (blood) parents belong to:</h2>
            <p>(Your choice of answer must include both parents: Father and Mother)</p>

            <fieldset>
                <legend>Father</legend>
                <div className="clearfix"></div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="father"
                            value="White (Caucasian)"
                            checked={father === 'White (Caucasian)'}
                            onChange={handleFatherChange}
                        />
                        White (Caucasian)
                    </label>
                </div>
                <Image
                    width={500}
                    height={500}
                    src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/parents.jpg"
                    alt="Photo of a father and his adult son"
                />
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="father"
                            value="Aboriginal"
                            checked={father === 'Aboriginal'}
                            onChange={handleFatherChange}
                        />
                        Aboriginal
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="father"
                            value="Black (Afro-Caribbean)"
                            checked={father === 'Black (Afro-Caribbean)'}
                            onChange={handleFatherChange}
                        />
                        Black (Afro-Caribbean)
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="father"
                            value="East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)"
                            checked={father === 'East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)'}
                            onChange={handleFatherChange}
                        />
                        East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="father"
                            value="South Asian (East Indian, Pakistani, Sri Lankan, etc.)"
                            checked={father === 'South Asian (East Indian, Pakistani, Sri Lankan, etc.)'}
                            onChange={handleFatherChange}
                        />
                        South Asian (East Indian, Pakistani, Sri Lankan, etc.)
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="father"
                            value="Other (Latin American, Arab, West Asian)"
                            checked={father === 'Other (Latin American, Arab, West Asian)'}
                            onChange={handleFatherChange}
                        />
                        Other (Latin American, Arab, West Asian)
                    </label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Mother</legend>
                <div className="clearfix"></div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="mother"
                            value="White (Caucasian)"
                            checked={mother === 'White (Caucasian)'}
                            onChange={handleMotherChange}
                        />
                        White (Caucasian)
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="mother"
                            value="Aboriginal"
                            checked={mother === 'Aboriginal'}
                            onChange={handleMotherChange}
                        />
                        Aboriginal
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="mother"
                            value="Black (Afro-Caribbean)"
                            checked={mother === 'Black (Afro-Caribbean)'}
                            onChange={handleMotherChange}
                        />
                        Black (Afro-Caribbean)
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="mother"
                            value="East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)"
                            checked={mother === 'East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)'}
                            onChange={handleMotherChange}
                        />
                        East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="mother"
                            value="South Asian (East Indian, Pakistani, Sri Lankan, etc.)"
                            checked={mother === 'South Asian (East Indian, Pakistani, Sri Lankan, etc.)'}
                            onChange={handleMotherChange}
                        />
                        South Asian (East Indian, Pakistani, Sri Lankan, etc.)
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="mother"
                            value="Other (Latin American, Arab, West Asian)"
                            checked={mother === 'Other (Latin American, Arab, West Asian)'}
                            onChange={handleMotherChange}
                        />
                        Other (Latin American, Arab, West Asian)
                    </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Certain ethno-cultural groups are at higher risk of developing diabetes. The diabetes risk due to ethnicity cannot be interpreted by itself without also considering the impact of other risk factors on the overall CANRISK score.
            </div>
        </section>
    );
}

export default StepTwelve;