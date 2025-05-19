/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import type { InputData } from './Questionair';

type InformationProps = {
  score: number | null;
  data: InputData | null;
  onNext: () => void;
};

function Information({ score, data, onNext }: InformationProps) {
    return (
        <section className="border border-gray-200 p-6 rounded-xl bg-white text-slate-800" id="more-info" tabIndex={-1}>
            <h2 tabIndex={-1} className='text-xl font-bold my-5'>More information</h2>

            <p className='my-3'>Diabetes is a serious chronic disease and uncontrolled diabetes can lead to heart disease, kidney disease and other conditions.</p>
            <p className='my-3'>While you can't change some factors such as age, gender, family history, and ethno-cultural background, other risk factors for diabetes may respond to lifestyle changes. These include weight, physical activity, diet, and smoking.</p>
            <p className='my-3'>If your <abbr title="body mass index">BMI</abbr> result is 25 or higher, lowering your weight may help you reduce your risk of developing type 2 diabetes. Even a small change in body weight or physical activity can reduce your risk.</p>
            <p className='my-3'>Embrace a healthy balanced diet which emphasizes vegetables, fruit, and whole grains. Consult <a href="http://www.hc-sc.gc.ca/fn-an/food-guide-aliment/index-eng.php" rel="external">Canada's Food Guide</a> for helpful suggestions.</p>
            <p className='my-3'>If you are not active, begin slowly and increase your activity gradually. Check with your doctor before beginning any exercise program.</p>
            <p className='my-3'>If you smoke, it's never too late to quit.</p><p><strong>Every step you take to improve your health counts!</strong></p>
            <p className='my-3'>Thank you for completing the Canadian diabetes risk questionnaire.</p>

            <h3 className='text-xl font-bold my-5'>Links of interest</h3>

            <ul className="list-disc list-inside my-4 space-y-2">
                <li>
                    <a
                        href="http://www.phac-aspc.gc.ca/cd-mc/publications/diabetes-diabete/your-guide-votre-guide/index-eng.php"
                        rel="external"
                        className="text-blue-600 hover:underline"
                    >
                        Your guide to diabetes
                    </a>
                </li>
                <li>
                    <a
                        href="http://www.phac-aspc.gc.ca/cd-mc/diabetes-diabete/index-eng.php"
                        rel="external"
                        className="text-blue-600 hover:underline"
                    >
                        More information on diabetes
                    </a>
                </li>
                <li>
                    <a
                        href="http://www.hc-sc.gc.ca/hc-ps/tobac-tabac/index-eng.php"
                        rel="external"
                        className="text-blue-600 hover:underline"
                    >
                        Go smoke free
                    </a>
                </li>
            </ul>

            <div className="well"><p>These risk scores are in no way a substitute for actual clinical diagnosis. If you have any concerns, please consider discussing your results with a health care practitioner, (e.g. family doctor, nurse practitioner, pharmacist etc).</p></div>
            <button className='mt-6 px-4 py-2 bg-blue-500 text-white rounded' onClick={onNext}>
                Next: Share
            </button>
        </section>
    );
}

export default Information