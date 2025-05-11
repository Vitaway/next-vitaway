import Image from 'next/image'
import React from 'react'

function StepThree() {
    return (
        <section id="gender-content" data-start-quiz-page="1">
            <h2 tabIndex={-1}>Are you male or female?</h2>
            <div className="text-center">
                <fieldset id="male-female-choice" className='flex'>
                    <label className="text-center">
                        <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/gender-male.jpg" alt="Picture of a man" />
                        <br />
                        <input type="radio" name="gender" value="6" />&nbsp;Male                            </label>
                    <label className="text-center">
                        <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/gender-female.jpg" alt="Picture of a woman" />
                        <br />
                        <input type="radio" name="gender" value="0" />&nbsp;
                        Female                            
                    </label>
                </fieldset>
            </div>

            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Males are at a higher risk for developing type 2 diabetes.
            </div>
        </section>
    )
}

export default StepThree