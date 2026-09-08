'use client';

import React, { useState } from 'react';
import ShopCartItem from './shop-cart-item';
import { useCart } from '@/context/CartContext';
import { Products } from '@/types/products';
import CheckoutForm from '../components/forms/checkout-form';
import Image from 'next/image';
import AlertModal from '../components/alerts/alert-modal';
import PressButton from '../components/buttons/press-button';

interface CartItem {
    price: number;
    quantity: number;
}

function ShoppingCart({ className = 'text-[#003E48]' }: { className?: string }) {
    const [isCartOpen, setCartOpen] = useState(false);
    const [isCheckoutOpen, setOpenCheckout] = useState(false);

    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);
    const openCheckout = () => setOpenCheckout(true);
    const closeCheckout = () => setOpenCheckout(false);
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

    const { cart, removeFromCart } = useCart();

    const total: number = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    const totalItems: number = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

    const handlePaymentCallback = () => {
        setShowAlert(true);

        setAlert({
            title: 'Payment Successful',
            message: 'Your payment has been successfully processed. Thank you for your purchase!',
            status: 'success',
            actionUrl: ''
        });

        closeCart();
    }

    return (
        <>
            <button
                type="button"
                onClick={openCart}
                aria-label="Shopping cart"
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#003E48]/8 ${className}`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 6h15l-1.5 9h-12z" />
                    <path d="M6 6 5 3H2" />
                    <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
                    <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E85A2E] px-1 text-[10px] font-semibold text-white">
                        {totalItems > 9 ? '9+' : totalItems}
                    </span>
                )}
            </button>

            {isCartOpen && (
                <button
                    type="button"
                    aria-label="Close cart overlay"
                    onClick={closeCart}
                    className="fixed inset-0 z-40 bg-[#003E48]/30"
                />
            )}

            <div className={`fixed top-0 right-0 bottom-0 z-50 max-w-xl overflow-hidden rounded-tl-[22px] rounded-bl-[22px] bg-white text-[#003E48] shadow-xl transform transition-transform duration-300 sm:rounded-tl-[28px] sm:rounded-bl-[28px] ${isCartOpen ? 'translate-x-0' : 'invisible pointer-events-none translate-x-full'}`} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="relative border-b border-[#003E48]/10 bg-[#F6F3EE] px-5 py-5">
                    <div className="mb-5 mt-5 w-full rounded-full bg-[#5CE0C6]/40 px-5 py-2 text-center text-sm text-[#003E48]">
                        <p>Free delivery anywhere for order above 50K in kigali</p>
                    </div>
                    <div>
                        <h5 className="text-xl font-bold text-[#003E48]">Shopping Cart</h5>
                        <span className="mt-1 text-[#003E48]/70">Total: {Number(total).toLocaleString()}</span>
                    </div>

                    <button onClick={closeCart} type="button" className="absolute right-3 top-3 cursor-pointer rounded-full p-1 text-[#003E48] hover:bg-white" data-bs-dismiss="offcanvas" aria-label="Close">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-x"
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

                <div className="offcanvas-body bg-white p-4">
                    <div>
                        {cart.length === 0 && <div className="flex items-center justify-center text-center">
                            <div>
                                <Image src='/svgs/carts.svg' alt='blogs' width={300} height={300} />
                                <span className='font-bold text-[#003E48]'>No Items in Cart.</span>
                            </div>
                        </div>}

                        <ul className="list-none max-h-[58vh] overflow-auto">
                            {cart && cart.map((product: Products) => (<ShopCartItem key={product.id} product={product} onRemoveFromCart={removeFromCart} />))}
                        </ul>

                        <div className="flex items-center justify-between border-t border-[#003E48]/10 pt-4">
                            {cart.length > 0 && (
                                <PressButton onClick={openCheckout} size="sm">
                                    Checkout Now
                                </PressButton>
                            )}

                            <button
                                type="button"
                                onClick={closeCart}
                                className="inline-flex cursor-pointer items-center rounded-full bg-[#F6F3EE] px-4 py-2 text-sm font-semibold text-[#003E48] hover:bg-[#003E48]/8"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutForm isOpen={isCheckoutOpen} onClose={closeCheckout} callback={handlePaymentCallback} />

            {showAlert && <AlertModal title={alert.title} message={alert.message} status={alert.status} actionUrl={alert.actionUrl} onOk={() => setShowAlert(false)} onClose={() => setShowAlert(false)} />}
        </>
    );
}

export default ShoppingCart;
