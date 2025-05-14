import React from 'react'

function StepTwo() {
    return (
        <section id="start-content" data-pre-quiz="1">
            <h2 tabIndex={-1}>The Canadian diabetes risk questionnaire</h2>
            <p>The following questions will help you to find out if you are at higher risk of having pre-diabetes or <a href="http://www.phac-aspc.gc.ca/cd-mc/diabetes-diabete/type2-eng.php" rel="external">type 2 diabetes</a>. Pre-diabetes is a condition where blood sugar levels are higher than normal, but not high enough to be diagnosed as diabetes. You can have pre-diabetes or undiagnosed type 2 diabetes without having any obvious warning signs or symptoms.</p><p>Knowing your risk can help you to make healthy choices now that will reduce your risk or even prevent you from developing diabetes.</p><p>You will be asked questions about important risk factors for diabetes. These include your age, family history of diabetes, ethnicity, and other factors. You will also be asked to measure your waist circumference.</p><p>Please answer the questions as honestly and completely as you can. The answers to these questions are completely confidential and are meant to help you better understand your risks of developing type 2 diabetes. In order to accurately assess your risk, each question must be answered.</p><p><strong>This questionnaire is intended primarily mainly for adults aged 40 to 74 years, though it may also be applied to younger persons with apparent risk factors (e.g. overweight or from non-Caucasian ethnic groups).</strong></p>

            <div className="warning">
                <p>The Public Health Agency of Canada is not permanently storing or collecting information users provide while completing the CANRISK questionnaire.  Any information provided is automatically deleted when the user closes the online session linked to the questionnaire.  To protect your personal information when online it is good practice to clear the Web browser cache regularly, delete any search history and protect any printed personal information.</p><p>For more information: <a href="http://www.phac-aspc.gc.ca/im-ai-eng.php#priv" rel="external">Government of Canada Privacy Statement</a>.</p>
            </div>
        </section>
    )
}

export default StepTwo