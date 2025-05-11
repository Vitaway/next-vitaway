import React from 'react'

function StepSix() {
    return (
        <section id="waist-content">
            <h2 tabIndex={-1}>What is your waist circumference?</h2>
            <p>To help you calculate this, use a tape measure; place it around your waist at the level of your belly button. Breathe out. Do not hold your breath, then measure.</p><p>Use the slider on the ruler below which will indicate the appropriate number.</p><p>You can also enter the information by typing it in the box.</p>

            <div className="waist-outer">
                <div className="text-center waist">
                    <div className="form-group">
                        <label>
                            Enter your waist size <span className="wb-inv">in inches</span>&nbsp;
                            <input type="text" name="waistInput" id="waistInput" className="form-control" placeholder="Ex: 101cm or 40 in" />
                        </label>
                    </div>
                    <div className="range-wrapper hidden-print">
                        <label htmlFor="waistRange" className="sr-only"><span>Use the slider to select your waist size or type it in the box above</span></label>
                        <input data-initial="1" type="range" id="waistRange" min="50.8" max="203.2" />
                        <ul className="labels">
                            <li>51cm / 20 in</li>
                            <li>203cm / 80 in</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Body fat stored around the abdomen (rather than the hips and thighs) is a risk factor for developing type 2 diabetes.                    </div>
        </section>
    )
}

export default StepSix