import React, { useState } from 'react'
import FormModal from '../models/form-model'
import TextInput from '../inputs/TextInput'

function CheckoutForm({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [customerName, setCustomerName] = useState<string>('')

    return (<>
        <FormModal isOpen={isOpen} onClose={onClose}>
            <h1 className='text-slate-700 text-xl font-semibold'>Checkout Form</h1>

            <div className="flex flex-col gap-4 p-4">
                <TextInput
                    label="Customer Name"
                    placeholder="Eg: John Doe"
                    type='text'
                    value={customerName}
                    onChange={setCustomerName}
                    errorMessage={customerName === "" ? "Customer Name is required" : ""}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </TextInput>
            </div>
        </FormModal>
    </>)
}

export default CheckoutForm