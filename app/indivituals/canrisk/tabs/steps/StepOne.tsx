/* eslint-disable react/no-unescaped-entities */
import React from 'react'

function StepOne() {
    return (<>
        <h2 className='font-bold text-2xl text-slate-700 mt-4'>The <span className='text-red-700'>Canadian</span> diabetes risk questionnaire</h2>
        <h1 className='font-bold text-4xl text-red-700'>CANRISK</h1>
        <div className='mt-4'>
            <h3 className='text-lg font-semibold text-slate-700'>Are you at risk of having pre-diabetes or type 2 diabetes?</h3>
            <p className='text-slate-600 mt-2'>Welcome to the Public Health Agency of Canada's Canadian diabetes risk questionnaire</p>

            <p className='text-slate-600 mt-4'>This questionnaire is optimised for the latest browsers:</p>
            <ul className='list-disc list-inside mt-2 text-slate-600 ml-4'>
                <li>Chrome</li>
                <li>Firefox</li>
                <li>Microsoft Edge</li>
                <li>Microsoft Internet Explorer</li>
                <li>Opera</li>
                <li>Safari</li>
            </ul>
        </div>
    </>)
}

export default StepOne