/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import FormModal from '../models/form-model'
import TextInput from '../inputs/TextInput'
import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products';
import AlertMessage from '../alerts/alert-message';
import FetchLoader from '../spinners/fetching-loader';

declare global {
    interface Window {
        IremboPay?: {
            initiate: (config: {
                publicKey: string;
                invoiceNumber: string;
                locale: string;
                callback: (err: Error | null, resp: { status: string; data?: unknown }) => void;
            }) => void;
            locale: {
                EN: string;
            };
            closeModal: () => void;
        };
    }
}

function CheckoutForm({ isOpen, onClose, callback }: { isOpen: boolean, onClose: () => void, callback: () => void }) {
    const [customerName, setCustomerName] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState<string>('');
    const [customerPhone, setCustomerPhone] = useState<string>('');
    const [recipientName, setRecipientName] = useState<string>('');
    const [recipientEmail, setRecipientEmail] = useState<string>('');
    const [recipientPhone, setRecipientPhone] = useState<string>('');
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [recipientCity, setRecipientCity] = useState<string>('');
    const [recipientCountry, setRecipientCountry] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const [customerNameError, setCustomerNameError] = useState<string>('');
    const [customerEmailError, setCustomerEmailError] = useState<string>('');
    const [customerPhoneError, setCustomerPhoneError] = useState<string>('');
    const [recipientNameError, setRecipientNameError] = useState<string>('');
    const [recipientEmailError, setRecipientEmailError] = useState<string>('');
    const [recipientPhoneError, setRecipientPhoneError] = useState<string>('');
    const [recipientAddressError, setRecipientAddressError] = useState<string>('');
    const [recipientCityError, setRecipientCityError] = useState<string>('');
    const [recipientCountryError, setRecipientCountryError] = useState<string>('');

    const { cart, clearCart } = useCart();

    const sendPaymentCallback = async (invoiceNumber: string) => {
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/payments/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ transaction_id: invoiceNumber }),
            });

            if (!response.ok) {
                setLoading(false);
                setMessageType('error');
                setMessage('Network Error - Payment callback failed. Please try again.');
                return;
            }

            clearCart();
            onClose();

            setLoading(false);
            setMessageType('success');
            setMessage('Payment Approved and Processed successful. Thank you for your order!');

            callback();
        } catch (error) {
            setLoading(false);
            setMessageType('error');
            setMessage('Error - Payment callback failed. Please try again.');
        }
    }

    const makePayment = (invoiceNumber: string) => {
        if (typeof window.IremboPay !== 'undefined') {
            window.IremboPay.initiate({
                publicKey: "pk_live_da91b566a86e4341a1348103256f6195",
                invoiceNumber: invoiceNumber,
                locale: window.IremboPay.locale.EN,
                callback: (err, resp) => {
                    if (!err) {
                        window.IremboPay?.closeModal();
                        sendPaymentCallback(invoiceNumber);
                    } else {
                        setLoading(false);
                        setMessageType('error');
                        setMessage('Error - Payment failed. Please try again.');
                    }
                }
            });
        } else {
            setLoading(false);
            setMessageType('error');
            setMessage('Error - IremboPay script not loaded yet. Please try again.');
        }
    };

    const prrocessPayment = async () => {
        setLoading(true);

        if (!formValidation()) {
            setLoading(false);
            setMessageType('error');
            setMessage('Error - Please fill all the required fields.');
            return;
        }

        if (cart.length === 0) {
            setLoading(false);
            setMessageType('error');
            setMessage('Error - Cart is empty. Please add products to your cart.');
            return;
        }

        try {
            const payload = {
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                recipient_name: recipientName,
                recipient_email: recipientEmail,
                recipient_phone: recipientPhone,
                recipient_address: recipientAddress,
                recipient_city: recipientCity,
                recipient_country: recipientCountry,
                products: [
                    ...cart.map((product: Products) => {
                        return {
                            id: product.id,
                            quantity: product.quantity,
                        }
                    })
                ]
            };

            const response = await fetch('http://127.0.0.1:8000/api/products/payments/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setLoading(false);
                setMessageType('error');
                setMessage('Network Error - Processing payment failed. Please try again.');
                return;
            }

            const data = await response.json();

            setLoading(false);
            makePayment(data.data.invoiceNumber);
        } catch (error) {
            setLoading(false);
            setMessageType('error');
            setMessage('Error - Processing payment failed. Please try again.');
        }
    }

    const formValidation = () => {
        let isValid = true;

        if (customerName.trim() === '') {
            setCustomerNameError('Customer name is required');
            isValid = false;
        } else {
            setCustomerNameError('');
        }

        if (customerEmail.trim() === '') {
            setCustomerEmailError('Customer email is required');
            isValid = false;
        } else {
            setCustomerEmailError('');
        }

        if (customerPhone.trim() === '') {
            setCustomerPhoneError('Customer phone number is required');
            isValid = false;
        } else if (customerPhone.trim().length !== 10) {
            setCustomerPhoneError('Customer phone number must be exactly 10 digits');
            isValid = false;
        } else {
            setCustomerPhoneError('');
        }

        if (recipientName.trim() === '') {
            setRecipientNameError('Recipient name is required');
            isValid = false;
        } else {
            setRecipientNameError('');
        }

        if (recipientEmail.trim() === '') {
            setRecipientEmailError('Recipient email is required');
            isValid = false;
        } else {
            setRecipientEmailError('');
        }

        if (recipientPhone.trim() === '') {
            setRecipientPhoneError('Recipient phone number is required');
            isValid = false;
        } else if (recipientPhone.trim().length !== 10) {
            setRecipientPhoneError('Recipient phone number must be exactly 10 digits');
            isValid = false;
        } else {
            setRecipientPhoneError('');
        }

        if (recipientAddress.trim() === '') {
            setRecipientAddressError('Recipient address is required');
            isValid = false;
        } else {
            setRecipientAddressError('');
        }

        if (recipientCity.trim() === '') {
            setRecipientCityError('Recipient city is required');
            isValid = false;
        } else {
            setRecipientCityError('');
        }

        if (recipientCountry.trim() === '') {
            setRecipientCountryError('Recipient country is required');
            isValid = false;
        } else {
            setRecipientCountryError('');
        }

        return isValid;
    }

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://dashboard.sandbox.irembopay.com/assets/payment/inline.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (<>
        <FormModal isOpen={isOpen} onClose={onClose}>
            <div>
                <h1 className='text-slate-700 text-xl font-semibold'>Checkout Form</h1>

                <div className="flex flex-col gap-2 p-4">
                    <TextInput
                        label="Customer Name"
                        placeholder="Eg: John Doe"
                        type='text'
                        value={customerName}
                        onChange={setCustomerName}
                        errorMessage={customerNameError}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </TextInput>
                    <TextInput
                        label="Customer Email"
                        placeholder="Eg: example@example.com"
                        type='email'
                        value={customerEmail}
                        onChange={setCustomerEmail}
                        errorMessage={customerEmailError}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </TextInput>
                    <TextInput
                        label="Customer Phone Number"
                        placeholder="Eg: 0712345678"
                        type='number'
                        value={customerPhone}
                        onChange={setCustomerPhone}
                        errorMessage={customerPhoneError}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </TextInput>
                    <div className='flex gap-2'>
                        <TextInput
                            label="Recipient Name"
                            placeholder="Eg: John Doe"
                            type='text'
                            value={recipientName}
                            onChange={setRecipientName}
                            errorMessage={recipientNameError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>
                        <TextInput
                            label="Recipient Email"
                            placeholder="Eg: example@example.com"
                            type='email'
                            value={recipientEmail}
                            onChange={setRecipientEmail}
                            errorMessage={recipientEmailError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>
                    </div>
                    <div className='flex gap-2'>
                        <TextInput
                            label="Recipient Phone Number"
                            placeholder="Eg: 0780987721"
                            type='number'
                            value={recipientPhone}
                            onChange={setRecipientPhone}
                            errorMessage={recipientPhoneError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>
                        <TextInput
                            label="Recipient Address"
                            placeholder="Eg: 123 Main St"
                            type='text'
                            value={recipientAddress}
                            onChange={setRecipientAddress}
                            errorMessage={recipientAddressError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>
                    </div>
                    <div className='flex gap-2'>
                        <TextInput
                            label="Recipient City"
                            placeholder="Eg: Kigali"
                            type='text'
                            value={recipientCity}
                            onChange={setRecipientCity}
                            errorMessage={recipientCityError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>
                        <TextInput
                            label="Recipient Country"
                            placeholder="Eg: Rwanda"
                            type='text'
                            value={recipientCountry}
                            onChange={setRecipientCountry}
                            errorMessage={recipientCountryError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>
                    </div>

                    <div className="flex justify-between border-t border-gray-200 pt-4">
                        {loading ? <button className='btn btn-primary' disabled>Loading...</button> : (
                            <div onClick={prrocessPayment} className="rounded-lg cursor-pointer px-3 py-2 inline-flex items-center gap-x-2 bg-[#1a1a2e] text-white border-[#1a1a2e] disabled:opacity-50 disabled:pointer-events-none hover:text-white hover:bg-green-700 hover:border-green-700 active:bg-green-700 active:border-green-700 focus:outline-none focus:ring-4 focus:ring-green-300">
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 19c0 .75-.21 1.46-.58 2.06A3.97 3.97 0 0 1 5 23a3.97 3.97 0 0 1-3.42-1.94A3.92 3.92 0 0 1 1 19c0-2.21 1.79-4 4-4s4 1.79 4 4Z" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="m3.441 19 .99.99 2.13-1.97" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M17.751 7.05c-.24-.04-.49-.05-.75-.05h-10c-.28 0-.55.02-.81.06.14-.28.34-.54.58-.78l3.25-3.26a3.525 3.525 0 0 1 4.96 0l1.75 1.77c.64.63.98 1.43 1.02 2.26Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 12v5c0 3-2 5-5 5H7.63c.31-.26.58-.58.79-.94.37-.6.58-1.31.58-2.06 0-2.21-1.79-4-4-4-1.2 0-2.27.53-3 1.36V12c0-2.72 1.64-4.62 4.19-4.94.26-.04.53-.06.81-.06h10c.26 0 .51.01.75.05C20.33 7.35 22 9.26 22 12Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M22 12.5h-3c-1.1 0-2 .9-2 2s.9 2 2 2h3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                                <span className='ml-2'>Process Payment</span>
                            </div>
                        )}
                    </div>

                    {loading && (<div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-black/20">
                        <FetchLoader />
                    </div>)}
                </div>

                <AlertMessage message={message} type={messageType} />
            </div>
        </FormModal>
    </>)
}

export default CheckoutForm