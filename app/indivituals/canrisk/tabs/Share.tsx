import Image from 'next/image'
import React from 'react'

function Share() {
    return (
        <section className="border border-gray-200 p-6 rounded-xl bg-white text-slate-800" id="share" tabIndex={-1}>
            <h2 tabIndex={-1} className='font-bold my-3'>Share the questionnaire</h2>
            <p>Encourage your friends and family to take the <b>CANRISK</b> questionnaire. You may help prevent someone you care about from developing pre-diabetes or diabetes type 2.</p>

            <h3 className="subtitle font-bold my-3">Share the questionnaire and create <b>awareness</b></h3>

            <p className='flex items-center'>
                <Image width={500} height={500} className='w-10 h-10' src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/share-email.gif" alt="Share" />
                <a href="mailto:?subject=CANRISK+the+Canadian+Diabetes+Risk+Questionnaire&amp;body=I+took+an+online+Diabetes+Risk+Questionnaire+to+find+out+if+I+am+at+risk.++If+you+would+like+to+try+the+questionnaire+I+have+included+the+link+in+this+e-mail+for+you.+It+is+from+the+Public+Health+Agency+of+Canada.%0A%0Ahttps%3A%2F%2Fwww.healthycanadians.gc.ca%2Fen%2Fcanrisk">
                    Send an e-mail and share the Canadian diabetes risk questionnaire.</a>
            </p>
            <div className="risk-score-shell">
                <p className='flex items-center'>
                    <Image width={500} height={500} className='w-10 h-10' src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/share-facebook.gif" alt="Facebook" />
                    <a href="http://www.facebook.com/sharer.php?u=http://publichealth.gc.ca/canrisk/index-eng.php&amp;title=The+CANRISK+questionnaire" rel="external" >
                        Share the questionnaire on your Facebook page</a>.
                </p>
                <p className='flex items-center'>
                    <Image width={500} height={500} className='w-10 h-10' src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/share-twitter.gif" alt="Twitter" />
                    <a href="http://twitter.com/home?status=http://publichealth.gc.ca/canrisk/index-eng.php&amp;title=The+CANRISK+questionnaire" rel="external" >
                        Send your Twitter followers a link to the questionnaire</a>.
                </p>
                <p className='flex items-center'>
                    <Image width={500} height={500} className='w-10 h-10' src="https://healthycanadians.gc.ca/apps/canrisk-standalone/images/print.jpg" alt="Print" />
                    <a href="https://healthycanadians.gc.ca/apps/canrisk-standalone/pdf/canrisk-en.pdf" rel="external" id="pdf-anchor">
                        You can also print the <abbr title="Portable Document Format">PDF</abbr> document version of the questionnaire.</a>
                </p>
            </div>
        </section>
    )
}

export default Share