import React, { useState } from 'react';

function StepFive({ onInputChange }: { onInputChange: (data: { height: string; weight: string }) => void }) {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = event.target.value;
        setHeight(newHeight);
        onInputChange({ height: newHeight, weight });
    };

    const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newWeight = event.target.value;
        setWeight(newWeight);
        onInputChange({ height, weight: newWeight });
    };

    return (
        <section id="bmi-content">
            <h2 tabIndex={-1}>What is your height and weight?</h2>
            <div className="info-box">
                <p>To calculate your <a href="http://www.hc-sc.gc.ca/fn-an/nutrition/weights-poids/guide-ld-adult/bmi_chart_java-graph_imc_java-eng.php" rel="external">body mass index</a> (BMI) use the graphic below.</p>
                <p>First indicate your height, then your weight.</p>
                <p>You can use the sliders on the graphics to set your height and weight or, you can enter the information using the boxes.</p>
            </div>

            <h3>What does <abbr title="body mass index">BMI</abbr> mean?</h3>
            <p>The <a href="http://www.hc-sc.gc.ca/fn-an/nutrition/weights-poids/guide-ld-adult/bmi_chart_java-graph_imc_java-eng.php" rel="external">Body Mass Index</a> (BMI) is an indicator of body fat based on height and weight. Most adults with a high <abbr title="body mass index">BMI</abbr> have a high percentage of body fat and extra body fat is associated with an increased risk of developing diabetes.</p>

            <div className="height-weight-outer modern-inputs" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0' }}>
                <div className="input-card" style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2rem', minWidth: 260, textAlign: 'center' }}>
                    <label htmlFor="heightInput" style={{ fontWeight: 600, fontSize: '1.1rem', color: '#333' }}>
                        Height
                    </label>
                    <input
                        type="number"
                        name="heightInput"
                        id="heightInput"
                        className="form-control modern-input"
                        placeholder="cm (e.g. 167)"
                        value={height}
                        min={122}
                        max={213}
                        onChange={handleHeightChange}
                        style={{
                            margin: '1rem 0 0.5rem 0',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e0e0e0',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'border 0.2s'
                        }}
                    />
                    <input
                        type="range"
                        id="heightRange"
                        min="121.92"
                        max="213.36"
                        step="0.01"
                        value={parseFloat(height) || 121.92}
                        onChange={(e) => handleHeightChange({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                        style={{
                            width: '100%',
                            margin: '1rem 0',
                            accentColor: '#0078d4'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#888' }}>
                        <span>122cm / 4ft</span>
                        <span>213cm / 7ft</span>
                    </div>
                </div>
                <div className="input-card" style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2rem', minWidth: 260, textAlign: 'center' }}>
                    <label htmlFor="weightInput" style={{ fontWeight: 600, fontSize: '1.1rem', color: '#333' }}>
                        Weight
                    </label>
                    <input
                        type="number"
                        name="weightInput"
                        id="weightInput"
                        className="form-control modern-input"
                        placeholder="kg (e.g. 84)"
                        value={weight}
                        min={45}
                        max={227}
                        onChange={handleWeightChange}
                        style={{
                            margin: '1rem 0 0.5rem 0',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e0e0e0',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'border 0.2s'
                        }}
                    />
                    <input
                        type="range"
                        id="weightRange"
                        min="45.3592"
                        max="226.796"
                        step="0.01"
                        value={parseFloat(weight) || 45.3592}
                        onChange={(e) => handleWeightChange({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                        style={{
                            width: '100%',
                            margin: '1rem 0',
                            accentColor: '#0078d4'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#888' }}>
                        <span>45kg / 100lbs</span>
                        <span>227kg / 500lbs</span>
                    </div>
                </div>
            </div>

            <div className="well">
                <p className="large">Your body mass index is <span id="bmi-score" className="label label-success label-as-badge"></span></p>

                <p><strong>According to the World Health Organization (WHO), <abbr title="body mass index">BMI</abbr> scores of:</strong></p>
                <ul id="bmi_ranking">
                    <li className="bmi_under">Below 18.5 = Underweight</li>
                    <li className="bmi_normal">18.5 - 24.9 = Normal</li>
                    <li className="bmi_over">25.0 - 29.9 = Overweight/Pre-obese</li>
                    <li className="bmi_obese">30.0 and over = Obese</li>
                </ul>
            </div>

            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Being overweight or obese increases your risk of developing diabetes. The more overweight you are, the higher your risk.
            </div>
        </section>
    );
}

export default StepFive;