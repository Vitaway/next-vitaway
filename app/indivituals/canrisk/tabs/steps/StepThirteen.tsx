/* eslint-disable react/no-unescaped-entities */
import React from 'react'

function StepThirteen() {
    return (
        <section id="education-content">
            <h2 tabIndex={-1}>What is the highest level of education you have completed?</h2>

            <fieldset>
                <div className="radio">
                    <label><input type="radio" name="education" value="5" />Some high school or less</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="education" value="1" />High school</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="education" value="0" />Some college or university</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="education" value="0" />College/University degree</label>
                </div>
            </fieldset>

            <div className="clearfix"></div>
            <div className="alert alert-info alert-no-icon">
                <h3>How education relates to healthy living?</h3>
                <ul>
                    <li>An individual's health status improves with level of education.</li>
                    <li>Education improves people's ability to access and understand information to help keep them healthy.</li>
                    <li>Education is closely tied to socioeconomic status, and effective education for children and lifelong learning for adults are key contributors to health.</li>
                </ul>
            </div>
        </section>
    )
}

export default StepThirteen