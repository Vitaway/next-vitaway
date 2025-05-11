/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import React from 'react'

function StepNine() {
    return (
        <section id="blood-sugar-content">
            <h2 tabIndex={-1}>Have you ever been found to have high blood sugar?</h2>
            <p>Choose all that apply</p>


            <fieldset>
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/lady.jpg" alt="" />
                
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="bloodSugar[]" value="1" />&nbsp;From a blood test                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="bloodSugar[]" value="1" />&nbsp;During an illness                            </label>
                </div>
                <div className="checkbox" data-exclude-gender="6">
                    <label>
                        <input type="checkbox" name="bloodSugar[]" value="1" />&nbsp;During pregnancy (gestational diabetes)                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="bloodSugar[]" value="0" />&nbsp;No                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="bloodSugar[]" value="0" />&nbsp;Don't know                            </label>
                </div>
            </fieldset>


            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                A previous test result indicating abnormally high blood sugar may indicate temporary metabolic problems or pre-diabetes.  An unusually high blood sugar maybe a warning sign that you are at high risk of developing full-blown diabetes in the future. Women who have had gestational diabetes (high blood sugar during pregnancy) are at higher risk of developing type 2 diabetes later in life.                    </div>
        </section>
    )
}

export default StepNine