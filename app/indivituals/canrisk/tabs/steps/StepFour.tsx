import Image from 'next/image'
import React from 'react'

function StepFour() {
    return (
        <section id="age-content">
            <h2 tabIndex={-1}>How old are you?</h2>
            <div className="info-box">
                To select your age on the ruler, click on the button and scroll left or right.
                <p>You can also enter your age by typing it in the box.</p>
            </div>

            <div id="age-inner" className="text-center">
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/age.jpg" alt="" />
                
                <div className="center-outer">
                    <div className="center-inner">
                        <div className="background text-center">
                            <div className="range-wrapper hidden-print">
                                <label htmlFor="ageRange" className="sr-only"><span>Use the slider to select your age or type it in the box bellow</span></label>
                                <input type="range" id="ageRange" min="25" max="75" />
                                <ul className="labels">
                                    <li>Under 25</li>
                                    <li>50</li>
                                    <li>Over 75</li>
                                </ul>
                            </div>
                            <div>
                                <label>
                                    Enter your age:&nbsp;
                                    <input type="text" size={3} maxLength={3} pattern="^(\d{2,3})$" value="" name="ageInput" id="ageInput" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="clearfix title-clear"></div>
            
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                As you get older, your risk of developing diabetes goes up.
            </div>
        </section>
    )
}

export default StepFour