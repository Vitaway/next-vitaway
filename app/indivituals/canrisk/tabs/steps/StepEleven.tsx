import Image from 'next/image'
import React from 'react'

function StepEleven() {
    return (
        <section id="family-content">
            <h2 tabIndex={-1}>Have any of your blood relatives ever been diagnosed with diabetes?</h2>
            <p>Choose all that apply</p>
            <fieldset>
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/mother-and-daughter.jpg" alt="Photo of a mother and her adult daugther" />
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="relatives[]" value="2" />&nbsp;Mother                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="relatives[]" value="2" />&nbsp;Father                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="relatives[]" value="2" />&nbsp;Brother(s)/Sister(s)                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="relatives[]" value="2" />&nbsp;Children                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="relatives[]" value="0" />&nbsp;Other                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="relatives[]" value="0" data-no-relative="1" />&nbsp;No, I have no blood relatives diagnosed with diabetes                            </label>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="relatives[]" value="0" data-no-relative="1" />&nbsp;I do not know                            </label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Families not only share genes which influence diabetes risk, but also shared culture and lifestyle (e.g. eating together at the same table).                    </div>
        </section>
    )
}

export default StepEleven