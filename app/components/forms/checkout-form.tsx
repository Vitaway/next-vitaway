/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import FormModal from '../models/form-model'
import TextInput from '../inputs/TextInput'
import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products';
import AlertMessage from '../alerts/alert-message';
import ShopCartItem from '@/app/shop/shop-cart-item';
import { Truck, Store } from 'lucide-react';
import rwandaData from '@/data/rwanda_geo.json';
import AlertModal from '../alerts/alert-modal';
import { ButtonSpinner } from '../spinners/Spinner';

declare global {
    interface Window {
        IremboPay?: {
            initiate: (config: {
                publicKey: string;
                invoiceNumber: string;
                locale: string;
                callback: (err: Error | null, resp: { status: string; data?: unknown }) => void;
            }) => void;
            locale: { EN: string; };
            closeModal: () => void;
        };
    }
}

interface CartItem {
    price: number;
    quantity: number;
}

function CheckoutForm({ isOpen, onClose, callback }: { isOpen: boolean, onClose: () => void, callback: () => void }) {
    const DEFAULT_SHIPPING_AMOUNT = 2000;
    const SHIPPING_DISCOUNT_THRESHOLD = 50000;
    const SHIPPING_DISCOUNT_AMOUNT = 0;
    const SHIPPING_DISCOUNT_PROVINCE = 'Kigali';
    const MAX_RETRIES = 2;

    const [customerName, setCustomerName] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState<string>('');
    const [customerPhone, setCustomerPhone] = useState<string>('');
    const [customerAddress, setCustomerAddress] = useState<string>('');
    const [customerCity, setCustomerCity] = useState<string>('');
    const [customerCountry, setCustomerCountry] = useState<string>('');

    const [recipientName, setRecipientName] = useState<string>('');
    const [recipientEmail, setRecipientEmail] = useState<string>('');
    const [recipientPhone, setRecipientPhone] = useState<string>('');
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [recipientCity, setRecipientCity] = useState<string>('');
    const [recipientCountry, setRecipientCountry] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [retryCount, setRetryCount] = useState<number>(0);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const [scriptError, setScriptError] = useState<boolean>(false);

    const [customerNameError, setCustomerNameError] = useState<string>('');
    const [customerEmailError, setCustomerEmailError] = useState<string>('');
    const [customerPhoneError, setCustomerPhoneError] = useState<string>('');
    const [customerAddressError, setCustomerAddressError] = useState<string>('');
    const [customerCityError, setCustomerCityError] = useState<string>('');
    const [customerCountryError, setCustomerCountryError] = useState<string>('');

    const [recipientNameError, setRecipientNameError] = useState<string>('');
    const [recipientEmailError, setRecipientEmailError] = useState<string>('');
    const [recipientPhoneError, setRecipientPhoneError] = useState<string>('');
    const [recipientAddressError, setRecipientAddressError] = useState<string>('');
    const [recipientCityError, setRecipientCityError] = useState<string>('');
    const [recipientCountryError, setRecipientCountryError] = useState<string>('');

    const [customerDiffRecipient, setCustomerDiffRecipient] = useState<boolean>(false);
    const [selected, setSelected] = useState<'ship' | 'pickup'>('ship');
    const [shippingAmount, setShippingAmount] = useState(DEFAULT_SHIPPING_AMOUNT);

    const [selectedCustomerProvince, setSelectedCustomerProvince] = useState('');
    const [selectedRecipientProvince, setSelectedRecipientProvince] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [alert, setAlert] = useState<{
        title: string;
        message: string;
        status: 'success' | 'error' | 'info';
        actionUrl: string;
    }>({
        title: '',
        message: '',
        status: 'success',
        actionUrl: ''
    });

    const provinces = Object.keys(rwandaData);

    const { cart, clearCart, removeFromCart } = useCart();
    const total: number = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

    const clearForm = () => {
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerAddress('');
        setCustomerCity('');
        setCustomerCountry('');

        setRecipientName('');
        setRecipientEmail('');
        setRecipientPhone('');
        setRecipientAddress('');
        setRecipientCity('');
        setRecipientCountry('');

        setSelected('ship');
        setShippingAmount(DEFAULT_SHIPPING_AMOUNT);
        setCustomerDiffRecipient(false);
    }

    const sendPaymentCallback = async (invoiceNumber: string) => {
        setPaymentProcessing(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/products/payments/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ transaction_id: invoiceNumber }),
            });

            if (!response.ok) {
                throw new Error(`Payment callback failed with status ${response.status}`);
            }

            const data = await response.json();

            // Success - clear cart and close modal
            clearCart();
            onClose();
            clearForm();
            callback();

            setShowAlert(true);
            setAlert({
                title: 'Payment Successful',
                message: 'Your payment has been successfully processed. Thank you for your purchase!',
                status: 'success',
                actionUrl: ''
            });
        } catch (error) {
            console.error('Payment callback error:', error);
            setShowAlert(true);
            setAlert({
                title: 'Payment Verification Failed',
                message: 'We couldn\'t verify your payment. Please contact support with your transaction reference.',
                status: 'error',
                actionUrl: ''
            });
        } finally {
            setPaymentProcessing(false);
            setLoading(false);
        }
    }

    const makePayment = (invoiceNumber: string) => {
        // Check if script is loaded
        if (!scriptLoaded || typeof window.IremboPay === 'undefined') {
            setLoading(false);
            setShowAlert(true);
            setAlert({
                title: 'Payment Gateway Loading',
                message: 'Payment gateway is still loading. Please wait a moment and try again.',
                status: 'info',
                actionUrl: ''
            });
            return;
        }

        setPaymentProcessing(true);
        
        try {
            window.IremboPay.initiate({
                publicKey: process.env.NEXT_PUBLIC_IREMBOPAY_PUBLIC_KEY || '',
                invoiceNumber: invoiceNumber,
                locale: window.IremboPay.locale.EN,
                callback: (err, resp) => {
                    if (!err && resp?.status === 'success') {
                        window.IremboPay?.closeModal();
                        sendPaymentCallback(invoiceNumber);
                    } else {
                        setLoading(false);
                        setPaymentProcessing(false);
                        setShowAlert(true);
                        setAlert({
                            title: 'Payment Failed',
                            message: err?.message || 'Your payment could not be processed. Please check your payment details and try again.',
                            status: 'error',
                            actionUrl: ''
                        });
                    }
                }
            });
        } catch (error) {
            console.error('IremboPay initiation error:', error);
            setLoading(false);
            setPaymentProcessing(false);
            setShowAlert(true);
            setAlert({
                title: 'Payment Error',
                message: 'An error occurred while initializing the payment. Please try again.',
                status: 'error',
                actionUrl: ''
            });
        }
    };

    const processPayment = async () => {
        if (loading) return; // Prevent double submission
        
        setLoading(true);
        setMessage('');

        if (!formValidation()) {
            setLoading(false);
            setMessageType('error');
            setMessage('Please fill all required fields correctly.');
            return;
        }

        if (cart.length === 0) {
            setLoading(false);
            setMessageType('error');
            setMessage('Your cart is empty. Please add products before checkout.');
            return;
        }

        try {
            const payload = {
                customer_name: customerName.trim(),
                customer_email: customerEmail.trim() || 'vitawayeclinic@gmail.com',
                customer_phone: customerPhone.trim(),
                customer_address: customerAddress.trim(),
                customer_city: customerCity.trim(),
                customer_country: customerCountry.trim(),

                recipient_name: customerDiffRecipient ? recipientName.trim() : customerName.trim(),
                recipient_email: customerDiffRecipient ? (recipientEmail.trim() || 'vitawayeclinic@gmail.com') : (customerEmail.trim() || 'vitawayeclinic@gmail.com'),
                recipient_phone: customerDiffRecipient ? recipientPhone.trim() : customerPhone.trim(),
                recipient_address: customerDiffRecipient ? recipientAddress.trim() : customerAddress.trim(),
                recipient_city: customerDiffRecipient ? recipientCity.trim() : customerCity.trim(),
                recipient_country: customerDiffRecipient ? recipientCountry.trim() : customerCountry.trim(),

                products: cart.map((product: Products) => ({
                    id: product.id,
                    quantity: product.quantity || 1,
                })),

                shipping_amount: shippingAmount,
                shipping_option: selected,
            };

            const axios = (await import('axios')).default;

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/products/payments/init`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 30000, // 30 second timeout
                }
            );

            if (response.status === 200 && response.data?.data?.invoiceNumber) {
                setRetryCount(0);
                makePayment(response.data.data.invoiceNumber);
            } else {
                throw new Error('Invalid payment response');
            }
        } catch (error) {
            console.error('Payment init error:', error);
            setLoading(false);
            
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setMessageType('error');
                setMessage(`Payment initialization failed. Retrying (${retryCount + 1}/${MAX_RETRIES})...`);
                setTimeout(() => processPayment(), 2000);
            } else {
                setMessageType('error');
                setMessage('Payment initialization failed. Please check your connection and try again.');
                setRetryCount(0);
            }
        }
    }

    const formValidation = () => {
        let isValid = true;

        // Customer name validation
        if (customerName.trim() === '') {
            setCustomerNameError('Customer name is required');
            isValid = false;
        } else if (customerName.trim().length < 2) {
            setCustomerNameError('Customer name must be at least 2 characters');
            isValid = false;
        } else {
            setCustomerNameError('');
        }

        // Email validation (optional but must be valid if provided)
        if (customerEmail.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(customerEmail.trim())) {
                setCustomerEmailError('Please enter a valid email address');
                isValid = false;
            } else {
                setCustomerEmailError('');
            }
        } else {
            setCustomerEmailError('');
        }

        // Phone validation
        if (customerPhone.trim() === '') {
            setCustomerPhoneError('Phone number is required');
            isValid = false;
        } else if (!/^\d{10}$/.test(customerPhone.trim())) {
            setCustomerPhoneError('Phone number must be exactly 10 digits');
            isValid = false;
        } else {
            setCustomerPhoneError('');
        }

        if (customerAddress.trim() === '') {
            setCustomerAddressError('Recipient address is required');
            isValid = false;
        } else {
            setCustomerAddressError('');
        }

        if (customerCity.trim() === '') {
            setCustomerCityError('Recipient city is required');
            isValid = false;
        } else {
            setCustomerCityError('');
        }

        if (customerCountry.trim() === '') {
            setCustomerCountryError('Recipient country is required');
            isValid = false;
        } else {
            setCustomerCountryError('');
        }

        if (customerDiffRecipient) {
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
        }

        return isValid;
    }

    const calculateShippingAmount = () => {
        const isEligibleForDiscount = (country: string) =>
            country === SHIPPING_DISCOUNT_PROVINCE && total > SHIPPING_DISCOUNT_THRESHOLD;

        if (customerDiffRecipient) {
            const shippingAmount = isEligibleForDiscount(recipientCountry) ? SHIPPING_DISCOUNT_AMOUNT : DEFAULT_SHIPPING_AMOUNT;
            setShippingAmount(shippingAmount);
        } else {
            setShippingAmount(isEligibleForDiscount(customerCountry) ? SHIPPING_DISCOUNT_AMOUNT : DEFAULT_SHIPPING_AMOUNT);
        }
    };

    const handleCustomerProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedCustomerProvince(selected);
        setCustomerCountry(selected);
        setCustomerCity('');
    };

    const handleCustomerDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCustomerCity(e.target.value);
    };

    const handleRecipientProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedRecipientProvince(selected);
        setRecipientCountry(selected);
        setRecipientCity('');
    };

    const handleRecipientDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRecipientCity(e.target.value);
    };

    const handleShipOption = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.value as 'ship' | 'pickup');
        setShippingAmount(e.target.value === 'ship' ? DEFAULT_SHIPPING_AMOUNT : 0);
    };

    useEffect(() => {
        calculateShippingAmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCustomerProvince, selectedRecipientProvince, customerCountry, recipientCountry, customerDiffRecipient]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = process.env.NEXT_PUBLIC_IREMBOPAY_JS_URL || '';
        script.async = true;

        // Add load event listener
        script.onload = () => {
            console.log('IremboPay script loaded successfully');
            setScriptLoaded(true);
            setScriptError(false);
        };

        // Add error event listener
        script.onerror = () => {
            console.error('Failed to load IremboPay script');
            setScriptLoaded(false);
            setScriptError(true);
            setMessageType('error');
            setMessage('Payment gateway failed to load. Please refresh the page.');
        };

        document.body.appendChild(script);

        // Check if already loaded (in case script loads super fast)
        const checkLoaded = setInterval(() => {
            if (typeof window.IremboPay !== 'undefined') {
                setScriptLoaded(true);
                clearInterval(checkLoaded);
            }
        }, 100);

        return () => {
            clearInterval(checkLoaded);
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (<>
        <FormModal width='max-w-[80vw]' height='max-h-[90vh]' isOpen={isOpen} onClose={onClose}>
            <div>
                <h1 className='text-slate-700 text-xl font-semibold'>Checkout Form</h1>

                <div className='flex w-full flex-col md:flex-row'>
                    <div className="flex flex-col gap-2 p-0 w-full mt-5 md:mt-0 md:p-4 md:max-w-1/2">
                        <TextInput
                            label="Full name"
                            placeholder="Eg: John Doe"
                            type='text'
                            value={customerName}
                            onChange={setCustomerName}
                            errorMessage={customerNameError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>

                        <TextInput
                            label="Email Address"
                            placeholder="Eg: ex@example.com"
                            type='email'
                            value={customerEmail}
                            onChange={setCustomerEmail}
                            errorMessage={customerEmailError}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </TextInput>

                        <div>
                            <TextInput
                                label="Phone Number"
                                placeholder="Eg: 07.."
                                type='number'
                                value={customerPhone}
                                onChange={setCustomerPhone}
                                errorMessage={customerPhoneError}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            </TextInput>
                            <TextInput
                                label="Address"
                                placeholder="Eg: Main St"
                                type='text'
                                value={customerAddress}
                                onChange={setCustomerAddress}
                                errorMessage={customerAddressError}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            </TextInput>
                        </div>

                        <div className="flex gap-4">
                            {/* Province (customerCountry) */}
                            <div className="w-full sm:w-1/2">
                                <label className="font-semibold text-slate-700 capitalize text-md">Province</label>

                                <div className="mt-2 relative text-gray-400 focus-within:text-gray-600 transition-all duration-200">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </div>
                                    <select
                                        className="block w-full py-3 pl-12 pr-4 transition-all duration-200 border rounded-md focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                        value={selectedCustomerProvince}
                                        onChange={handleCustomerProvinceChange}
                                    >
                                        <option value="">Select Province</option>
                                        {provinces.map((province) => (
                                            <option key={province} value={province}>
                                                {province}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <span className="text-slate-800 mt-2">{selectedCustomerProvince}</span>
                                {customerCountryError && <p className="text-red-500 text-sm">{customerCountryError}</p>}
                            </div>

                            {/* District (customerCity) */}
                            <div className="w-full sm:w-1/2">
                                <label className="font-semibold text-slate-700 capitalize text-md">District</label>
                                <div className="mt-2 relative text-gray-400 focus-within:text-gray-600 transition-all duration-200">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </div>
                                    <select
                                        className="block w-full py-3 pl-12 pr-4 transition-all duration-200 border rounded-md focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                        value={customerCity}
                                        onChange={handleCustomerDistrictChange}
                                        disabled={!selectedCustomerProvince}
                                    >
                                        <option value="">Select District</option>
                                        {selectedCustomerProvince &&
                                            Object.keys(rwandaData[selectedCustomerProvince as keyof typeof rwandaData] || {}).map((district: string) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <span className="text-slate-800 mt-2">{customerCity}</span>
                                {customerCityError && <p className="text-red-500 text-sm">{customerCityError}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 border-t border-b border-gray-200 py-3 my-4">
                            <input
                                type="checkbox"
                                id="differentRecipient"
                                className="w-4 h-4"
                                onChange={(e) => {
                                    if (!e.target.checked) {
                                        setCustomerDiffRecipient(false)
                                    } else {
                                        setCustomerDiffRecipient(true)
                                    }
                                }}
                            />
                            <label htmlFor="differentRecipient" className="text-md font-bold text-gray-700">
                                Recipient is different from customer (Want someone to recieve an items)
                            </label>
                        </div>

                        {customerDiffRecipient && (
                            <div>
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
                                        placeholder="Eg: ex@example.com"
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
                                        placeholder="Eg: 07..."
                                        type='number'
                                        value={recipientPhone}
                                        onChange={setRecipientPhone}
                                        errorMessage={recipientPhoneError}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </TextInput>
                                    <TextInput
                                        label="Recipient Address"
                                        placeholder="Eg: Main St"
                                        type='text'
                                        value={recipientAddress}
                                        onChange={setRecipientAddress}
                                        errorMessage={recipientAddressError}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </TextInput>
                                </div>
                                <div className="flex gap-4">
                                    {/* Province (customerCountry) */}
                                    <div className="w-full sm:w-1/2">
                                        <label className="font-semibold text-slate-700 capitalize text-md">Province</label>

                                        <div className="mt-2 relative text-gray-400 focus-within:text-gray-600 transition-all duration-200">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                            </div>
                                            <select
                                                className="block w-full py-3 pl-12 pr-4 transition-all duration-200 border rounded-md focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                                value={selectedRecipientProvince}
                                                onChange={handleRecipientProvinceChange}
                                            >
                                                <option value="">Select Province</option>

                                                {provinces.map((province) => (
                                                    <option key={province} value={province}>
                                                        {province}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {recipientCountryError && <p className="text-red-500 text-sm">{recipientCountryError}</p>}
                                    </div>

                                    {/* District (customerCity) */}
                                    <div className="w-full sm:w-1/2">
                                        <label className="font-semibold text-slate-700 capitalize text-md">District</label>
                                        <div className="mt-2 relative text-gray-400 focus-within:text-gray-600 transition-all duration-200">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                            </div>
                                            <select
                                                className="block w-full py-3 pl-12 pr-4 transition-all duration-200 border rounded-md focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                                value={recipientCity}
                                                onChange={handleRecipientDistrictChange}
                                                disabled={!selectedRecipientProvince}
                                            >
                                                <option value="">Select District</option>

                                                {selectedRecipientProvince &&
                                                    Object.keys(rwandaData[selectedRecipientProvince as keyof typeof rwandaData] || {}).map((district: string) => (
                                                        <option key={district} value={district}>
                                                            {district}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        {recipientCityError && <p className="text-red-500 text-sm">{recipientCityError}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='border-none md:border-l border-gray-300 pl-0 md:pl-5 w-full md:max-w-1/2'>
                        <ul className="list-none overflow-auto max-h-[70vh]">
                            {cart && cart.map((product: Products) => (<ShopCartItem key={product.id} product={product} onRemoveFromCart={removeFromCart} />))}
                        </ul>

                        <div className="max-w-md mx-auto my-5">
                            <h2 className="text-slate-700 font-semibold mb-4">Delivery</h2>
                            <div className="rounded-md border overflow-hidden divide-y divide-gray-200">
                                {/* Ship Option */}
                                <label
                                    className={`flex items-center justify-between p-4 cursor-pointer ${selected === 'ship'
                                        ? 'bg-[#272749]/30 border-l-4 border-[#272749]'
                                        : 'bg-white'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value="ship"
                                            checked={selected === 'ship'}
                                            onChange={(e) => handleShipOption(e)}
                                            className="accent-[#272749] w-5 h-5"
                                        />
                                        <span className="text-black font-medium">Ship</span>
                                    </div>
                                    <Truck
                                        className={`w-5 h-5 ${selected === 'ship' ? 'text-[#272749]' : 'text-gray-400'
                                            }`}
                                    />
                                </label>

                                {/* Pickup Option */}
                                <label
                                    className={`flex items-center justify-between p-4 cursor-pointer ${selected === 'pickup'
                                        ? 'bg-[#272749]/30 border-l-4 border-[#272749]'
                                        : 'bg-white'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value="pickup"
                                            checked={selected === 'pickup'}
                                            onChange={(e) => handleShipOption(e)}
                                            className="accent-[#272749] w-5 h-5"
                                        />
                                        <span className="text-black font-medium">Pickup in store</span>
                                    </div>
                                    <Store
                                        className={`w-5 h-5 ${selected === 'pickup' ? 'text-[#272749]' : 'text-gray-400'
                                            }`}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='border-t border-gray-200 pt-5 text-slate-700 w-full'>
                            <div className='mt-1 flex items-center justify-between w-full'><div className='font-bold'>Customer Name:</div> <div className='max-w-42 line-clamp-1'>{customerDiffRecipient ? recipientName : customerName}</div></div>
                            <div className='mt-1 flex items-center justify-between w-full'>
                                <div className='font-bold'>Shipping Address:</div>
                                <div className='max-w-42 line-clamp-1'>
                                    {customerDiffRecipient
                                        ? [recipientAddress, recipientCity, recipientCountry].filter(Boolean).join(', ')
                                        : [customerAddress, customerCity, customerCountry].filter(Boolean).join(', ')}
                                </div>
                            </div>
                            <div className='mt-1 flex items-center justify-between w-full'><div className='font-bold'>Shipping Amount:</div> <div className='max-w-42 line-clamp-1'>RWF {Number(shippingAmount).toLocaleString()}</div></div>
                            <div className='mt-1 flex items-center justify-between w-full'><div className='font-bold'>Total Amount:</div> <div className='max-w-42 line-clamp-1'>RWF {Number(total + shippingAmount).toLocaleString()}</div></div>
                        </div>

                        <div className="flex justify-between border-t border-gray-200 pt-5 mt-5">
                            <div></div>
                            <button 
                                onClick={processPayment} 
                                disabled={loading || paymentProcessing || cart.length === 0 || scriptError}
                                className="rounded-lg cursor-pointer px-3 py-2 inline-flex items-center gap-x-2 bg-[#1a1a2e] text-white border-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed hover:text-white hover:bg-green-700 hover:border-green-700 active:bg-green-700 active:border-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
                            >
                                {loading || paymentProcessing ? (
                                    <ButtonSpinner loadingText={paymentProcessing ? "Processing" : "Initializing"} />
                                ) : !scriptLoaded ? (
                                    <ButtonSpinner loadingText="Loading payment gateway" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 19c0 .75-.21 1.46-.58 2.06A3.97 3.97 0 0 1 5 23a3.97 3.97 0 0 1-3.42-1.94A3.92 3.92 0 0 1 1 19c0-2.21 1.79-4 4-4s4 1.79 4 4Z" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="m3.441 19 .99.99 2.13-1.97" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M17.751 7.05c-.24-.04-.49-.05-.75-.05h-10c-.28 0-.55.02-.81.06.14-.28.34-.54.58-.78l3.25-3.26a3.525 3.525 0 0 1 4.96 0l1.75 1.77c.64.63.98 1.43 1.02 2.26Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 12v5c0 3-2 5-5 5H7.63c.31-.26.58-.58.79-.94.37-.6.58-1.31.58-2.06 0-2.21-1.79-4-4-4-1.2 0-2.27.53-3 1.36V12c0-2.72 1.64-4.62 4.19-4.94.26-.04.53-.06.81-.06h10c.26 0 .51.01.75.05C20.33 7.35 22 9.26 22 12Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M22 12.5h-3c-1.1 0-2 .9-2 2s.9 2 2 2h3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        <span className='ml-2'>Process Payment</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <AlertMessage message={message} type={messageType} />
                {showAlert && <AlertModal title={alert.title} message={alert.message} status={alert.status} actionUrl={alert.actionUrl} onOk={() => setShowAlert(false)} onClose={() => setShowAlert(false)} />}
            </div>
        </FormModal>
    </>)
}

export default CheckoutForm