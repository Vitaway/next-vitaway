'use client';

import ImageSlider from '@/app/components/cards/images-slider'
import React, { useState } from 'react'
import ProductSlider from './ProductSlider'
import CheckoutForm from '@/app/components/forms/checkout-form'
import AlertMessage from '@/app/components/alerts/alert-message'
import { Products } from '@/types/products'
import { useCart } from '@/context/CartContext'
import Image from 'next/image';

function ProductDetails({ product, relatedProducts, loading }: { product: Products, relatedProducts: Products[], loading: boolean }) {
    const [quantity, setQuantity] = useState(1);
    const [isCheckoutOpen, setOpenCheckout] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [isExpanded, setIsExpanded] = useState(false);

    const openCheckout = () => setOpenCheckout(true);
    const closeCheckout = () => setOpenCheckout(false);

    const { addToCart } = useCart();

    const buyNow = () => {
        addToCart(product, quantity);
        openCheckout();
    }

    const handlePaymentCallback = () => {
        setMessage('Payment Approved and Processed successful. Thank you for your order!');
        setMessageType('success');
    }
    return (<>
        <div className="bg-white border-t border-gray-200">
            <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/2 px-4 mb-8">
                        <ImageSlider images={product.images.map((img) => img.image_url)} alt={product.name} />
                        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {product.images.map((img) => (
                                <div key={img.image_url} className="hidden md:block">
                                    <Image
                                        src={img.image_url}
                                        alt={product.name}
                                        width={500}
                                        height={600}
                                        className="w-full h-auto max-h-[200px] min-h-[200px] object-cover border border-gray-200 rounded-xl"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 px-4">
                        <p className="text-gray-600 mb-4">{product.category.name}</p>
                        <h2 className="text-3xl font-bold mb-2 text-slate-800">{product.name}</h2>

                        <div className="my-6 flex items-center">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.3 7.92v5.15c0 3.08-1.76 4.4-4.4 4.4H6.11c-.45 0-.88-.04-1.28-.13-.25-.04-.49-.11-.71-.19-1.5-.56-2.41-1.86-2.41-4.08V7.92c0-3.08 1.76-4.4 4.4-4.4h8.79c2.24 0 3.85.95 4.28 3.12.07.4.12.81.12 1.28Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M22.298 10.92v5.15c0 3.08-1.76 4.4-4.4 4.4h-8.79c-.74 0-1.41-.1-1.99-.32-1.19-.44-2-1.35-2.29-2.81.4.09.83.13 1.28.13h8.79c2.64 0 4.4-1.32 4.4-4.4V7.92c0-.47-.04-.89-.12-1.28 1.9.4 3.12 1.74 3.12 4.28Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.5 13.14a2.64 2.64 0 1 0 0-5.28 2.64 2.64 0 0 0 0 5.28Z" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M4.781 8.3v4.4M16.219 8.3v4.4" stroke="#697689" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                            <span className="text-2xl ml-2 font-bold mr-2 text-slate-700">RWF {Number(product.price).toLocaleString()}</span>
                        </div>

                        <h2 className="font-bold text-xl text-slate-700">About this item</h2>
                        <div className="text-gray-700 my-4">
                            <p
                                className={`overflow-hidden ${product.description.length > 200 && !isExpanded ? 'line-clamp-6' : ''}`}
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                            {product.description.length > 200 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-indigo-600 hover:underline mt-2"
                                >
                                    {isExpanded ? 'See Less' : 'See More'}
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6 items-center space-y-4 sm:space-y-0 justify-between w-full">
                            <div className="w-full sm:w-auto mb-6 sm:mb-0">
                                <label className="font-bold text-md text-slate-700">Quantity:</label>

                                <div className="flex items-center space-x-2 mt-2 sm:mt-5">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="1"
                                        max="10"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-16 px-3 py-1 text-center text-slate-800 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity < 10 ? quantity + 1 : 10)}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-indigo-200">
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 justify-center">
                                <div className="w-full sm:w-auto">
                                    <button onClick={() => addToCart(product, quantity)} className="w-full sm:w-auto bg-[#272749] hover:bg-[#272749]/90 cursor-pointer flex justify-center gap-2 items-center text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        Add to Cart
                                    </button>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <button onClick={() => buyNow()} className="w-full sm:w-auto bg-[#272749] hover:bg-[#272749]/90 cursor-pointer flex justify-center gap-2 items-center text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke="#ffffff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedProducts && relatedProducts.length > 2 && (
                    <ProductSlider
                        relatedProducts={relatedProducts}
                        loading={loading}
                    />
                )}
            </div>
        </div>

        {/* Checkout Form */}
        <CheckoutForm isOpen={isCheckoutOpen} onClose={closeCheckout} callback={handlePaymentCallback} />

        <AlertMessage message={message} type={messageType} />
    </>)
}

export default ProductDetails