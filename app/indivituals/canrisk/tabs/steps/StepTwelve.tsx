import Image from 'next/image'
import React from 'react'

function StepTwelve() {
    return (
        <section id="parents-content">
            <h2 tabIndex={-1}>Please select which of the following ethnic groups your biological (blood) parents belong to:</h2>
            <p>(Your choice of answer must include both parents: Father and Mother)</p>


            <fieldset>
                <legend>Father</legend>
                <div className="clearfix"></div>
                <div className="radio">
                    <label><input type="radio" name="father" value="0" />White (Caucasian)</label>
                </div>
                <Image width={500} height={500} src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/parents.jpg" alt="Photo of a father and his adult son" />
                <div className="radio">
                    <label><input type="radio" name="father" value="3" />Aboriginal</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="father" value="5" />Black (Afro-Caribbean)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="father" value="10" />East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="father" value="11" />South Asian (East Indian, Pakistani, Sri Lankan, etc.)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="father" value="3" />Other (Latin American, Arab, West Asian)</label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Mother</legend>
                <div className="clearfix"></div>
                <div className="radio">
                    <label><input type="radio" name="mother" value="0" />White (Caucasian)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="mother" value="3" />Aboriginal</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="mother" value="5" />Black (Afro-Caribbean)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="mother" value="10" />East Asian (Chinese, Vietnamese, Filipino, Korean, etc.)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="mother" value="11" />South Asian (East Indian, Pakistani, Sri Lankan, etc.)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="mother" value="3" />Other (Latin American, Arab, West Asian)</label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>Did you know...</h3>
                Certain ethno-cultural groups are at higher risk of developing diabetes. The diabetes risk due to ethnicity cannot be interpreted by itself without also considering the impact of other risk factors on the overall CANRISK score.                    </div>
        </section>
    )
}

export default StepTwelve