import React, { useState } from 'react';
import ShopCartItem from './shop-cart-item';
import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products';
import CheckoutForm from '../components/forms/checkout-form';
import AlertMessage from '../components/alerts/alert-message';
import Image from 'next/image';

interface CartItem {
    price: number;
    quantity: number;
}

function ShoppingCart() {
    const [isCartOpen, setCartOpen] = useState(false);
    const [isCheckoutOpen, setOpenCheckout] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);
    const openCheckout = () => setOpenCheckout(true);
    const closeCheckout = () => setOpenCheckout(false);

    const { cart, removeFromCart } = useCart();

    const total: number = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    const totalItems: number = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

    const handlePaymentCallback = () => {
        setMessage('Payment Approved and Processed successful. Thank you for your order!');
        setMessageType('success');
        closeCart();
    }

    return (
        <>
            {/* Cart Icon */}
            <div className="relative cursor-pointer hover:bg-gray-200 rounded-full p-2" onClick={openCart}>
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M8.4 6.5h7.2c3.4 0 3.74 1.59 3.97 3.53l.9 7.5C20.76 19.99 20 22 16.5 22H7.51C4 22 3.24 19.99 3.54 17.53l.9-7.5C4.66 8.09 5 6.5 8.4 6.5Z"
                            stroke="#697689"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                        <path
                            opacity=".4"
                            d="M8 8V4.5C8 3 9 2 10.5 2h3C15 2 16 3 16 4.5V8M20.41 17.031H8"
                            stroke="#697689"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                </div>
                <div className="absolute -top-1 -right-1 bg-[#1a1a2e] w-5 h-5 rounded-full text-white text-sm px-1 py-1 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                </div>
            </div>

            {/* Cart Modal */}
            <div className={`fixed max-w-xl top-0 right-0 bottom-0 bg-white rounded-tl-xl rounded-bl-xl border border-gray-200 z-20 text-slate-700 shadow-md transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="border-b px-5 py-5 relative border-gray-300">
                    <div>
                        <h5 className="text-xl font-bold">Shopping Cart</h5>
                        <span className='mt-1'>Total: {Number(total).toLocaleString()}</span>
                    </div>

                    <button onClick={closeCart} type="button" className="btn-close text-inherit absolute right-3 top-3 cursor-pointer" data-bs-dismiss="offcanvas" aria-label="Close">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-x text-gray-700"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="offcanvas-body p-4">
                    <div>
                        {cart.length === 0 && <div className="text-center flex items-center justify-center">
                            <div className=''>
                                <Image src='/svgs/carts.svg' alt='blogs' width={300} height={300} />
                                <span className='font-bold text-slate-700'>No Items in Cart.</span>
                            </div>
                        </div>}

                        <ul className="list-none overflow-auto h-[70vh]">
                           {cart && cart.map((product: Products) => (<ShopCartItem key={product.id} product={product} onRemoveFromCart={removeFromCart} />))}
                        </ul>

                        <div className="flex justify-between border-t border-gray-200 pt-4">
                            {cart.length > 0 && (
                                <div onClick={openCheckout} className="rounded-lg cursor-pointer px-3 py-2 inline-flex items-center gap-x-2 bg-[#1a1a2e] text-white border-[#1a1a2e] disabled:opacity-50 disabled:pointer-events-none hover:text-white hover:bg-green-700 hover:border-green-700 active:bg-green-700 active:border-green-700 focus:outline-none focus:ring-4 focus:ring-green-300">
                                    <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 19c0 .75-.21 1.46-.58 2.06A3.97 3.97 0 0 1 5 23a3.97 3.97 0 0 1-3.42-1.94A3.92 3.92 0 0 1 1 19c0-2.21 1.79-4 4-4s4 1.79 4 4Z" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="m3.441 19 .99.99 2.13-1.97" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M17.751 7.05c-.24-.04-.49-.05-.75-.05h-10c-.28 0-.55.02-.81.06.14-.28.34-.54.58-.78l3.25-3.26a3.525 3.525 0 0 1 4.96 0l1.75 1.77c.64.63.98 1.43 1.02 2.26Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 12v5c0 3-2 5-5 5H7.63c.31-.26.58-.58.79-.94.37-.6.58-1.31.58-2.06 0-2.21-1.79-4-4-4-1.2 0-2.27.53-3 1.36V12c0-2.72 1.64-4.62 4.19-4.94.26-.04.53-.06.81-.06h10c.26 0 .51.01.75.05C20.33 7.35 22 9.26 22 12Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M22 12.5h-3c-1.1 0-2 .9-2 2s.9 2 2 2h3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                                    <span className='ml-2'>Checkout Now</span>
                                </div>
                            )}

                            <div onClick={closeCart} className="rounded-lg cursor-pointer px-3 py-2 inline-flex items-center gap-x-2 bg-gray-800 text-white border-gray-800 disabled:opacity-50 disabled:pointer-events-none hover:text-white hover:bg-gray-900 hover:border-gray-900 active:bg-gray-900 active:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300">
                                <span>Continue Shopping</span>
                                <span className='ml-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07"></path><path stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M3.5 12h16.83" opacity=".4"></path></svg></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Form */}
            <CheckoutForm isOpen={isCheckoutOpen} onClose={closeCheckout} callback={handlePaymentCallback} />

            <AlertMessage message={message} type={messageType} />
        </>
    );
}

export default ShoppingCart;