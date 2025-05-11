/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import React from 'react'

function StepSeven() {
    return (
        <section id="lifestyle-content">
            <h2 tabIndex={-1}>Do you usually do some physical activity such as brisk walking for at least 30 minutes each day?</h2>
            <p>(This activity can be done while at work or at home)</p>

            <fieldset>
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/pool.jpg" alt="Photo of a family in a pool" />
                <div className="radio">
                    <label>
                        <input type="radio" name="exercise" id="exerciseYes" value="0" />
                        Yes, I usually do some physical activity for at least 30 minutes each day                            </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" name="exercise" id="exerciseNo" value="1" />
                        No, I do not usually do some physical activity for at least 30 minutes each day                            </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Increasing physical activity is a key element in controlling weight and reducing the likelihood of developing type 2 diabetes. Brisk walking is a great way to become more active, and every step counts.  Aim for an average of 30 minutes per day, or 150 minutes per week. Consult your family doctor or health professional before increasing your physical activity level.                    </div>

            <h2>How often do you eat vegetables or fruits?</h2>

            <fieldset>
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/foods.jpg" alt="Photo of a man eating vegetables" />
                <div className="radio">
                    <label>
                        <input type="radio" name="vegetable" id="vegetableYes" value="0" />
                        I eat vegetables or fruits every day
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" name="vegetable" id="vegetableNo" value="2" />
                        I do not eat vegetables or fruits every day
                    </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                By eating foods that are rich in fibre, reducing the amount of fat and salt in food selections and adding more fruits and vegetables, you can help control your diet and maintain or lose weight. Canada's Food Guide recommends 7 to 10 servings of fruits and vegetables each day, depending on your age and sex.  Watch your total calories as well as the amount of fat, fibre and salt (sodium).                    </div>
        </section>
    )
}

export default StepSeven