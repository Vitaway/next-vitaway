import React from 'react'

function StepFive() {
    return (
        <section id="bmi-content">
            <h2 tabIndex={-1}>What is your height and weight?</h2>
            <div className="info-box">
                <p>To calculate your <a href="http://www.hc-sc.gc.ca/fn-an/nutrition/weights-poids/guide-ld-adult/bmi_chart_java-graph_imc_java-eng.php" rel="external">body mass index</a> (BMI) use the graphic below.</p><p>First indicate your height, then your weight.</p><p>You can use the sliders on the graphics to set your height and weight or, you can enter the information using the boxes.</p>
            </div>

            <h3>What does <abbr title="body mass index">BMI</abbr> mean?</h3>
            <p>The <a href="http://www.hc-sc.gc.ca/fn-an/nutrition/weights-poids/guide-ld-adult/bmi_chart_java-graph_imc_java-eng.php" rel="external">Body Mass Index</a> (BMI) is an indicator of body fat based on height and weight. Most adults with a high <abbr title="body mass index">BMI</abbr> have a high percentage of body fat and extra body fat is associated with an increased risk of developing diabetes.</p>


            <div className="height-weight-outer">
                <div className="text-center height">
                    <div className="form-group">
                        <label>
                            Enter your height:&nbsp;
                            <input type="text" name="heightInput" id="heightInput" className="form-control" placeholder="Ex: 167cm or 5 ft 6 in" />
                        </label>
                    </div>
                    <div className="range-wrapper hidden-print">
                        <label htmlFor="heightRange" className="sr-only"><span>Use the slider to select your height or type it in the box above</span></label>
                        <input data-initial="1" type="range" id="heightRange" min="121.92" max="213.36" />
                        <ul className="labels">
                            <li>122cm / 4 ft</li>
                            <li>213cm / 7 ft</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center weight">
                    <div className="form-group">
                        <label>
                            Enter your weight:&nbsp;
                            <input type="text" name="weightInput" id="weightInput" className="form-control" placeholder="Ex: 84kg or 185lbs" />
                        </label>
                    </div>
                    <div className="range-wrapper hidden-print">
                        <label htmlFor="weightRange" className="sr-only"><span>Use the slider to select your weight or type it in the box above</span></label>
                        <input data-initial="1" type="range" id="weightRange" min="45.3592" max="226.796" />
                        <ul className="labels">
                            <li>45kg / 100lbs</li>
                            <li>227kg / 500lbs</li>
                        </ul>
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
                Being overweight or obese increases your risk of developing diabetes. The more overweight you are, the higher your risk.                    </div>
        </section>
    )
}

export default StepFive