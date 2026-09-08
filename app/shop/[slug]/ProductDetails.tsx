'use client';

import ImageSlider from '@/app/components/cards/images-slider'
import React, { useState } from 'react'
import ProductSlider from './ProductSlider'
import CheckoutForm from '@/app/components/forms/checkout-form'
import AlertMessage from '@/app/components/alerts/alert-message'
import { Products } from '@/types/products'
import { useCart } from '@/context/CartContext'
import Image from 'next/image';
import PressButton from '@/app/components/buttons/press-button';

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
        <div className="flex flex-wrap -mx-4">
            <div className="mb-8 w-full px-4 md:w-1/2">
                <ImageSlider images={product.images && product.images.length > 0 ? product.images.map((img) => img.image_url) : []} alt={product.name} />

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {product.images && product.images.length > 2 && product.images.map((img) => (
                        <div key={img.image_url} className="hidden md:block">
                            <Image
                                src={img.image_url}
                                alt={product.name}
                                width={500}
                                height={600}
                                className="h-auto max-h-[200px] min-h-[200px] w-full rounded-[20px] object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full px-4 md:w-1/2">
                <p className="mb-4 inline-block rounded-full bg-[#F6F3EE] px-4 py-1.5 text-xs font-medium text-[#003E48]">{product.category.name}</p>
                <h2 className="mb-2 text-3xl font-bold text-[#003E48]">{product.name}</h2>

                <div className="my-6 flex items-center">
                    <span className="text-[#003E48]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.3 7.92v5.15c0 3.08-1.76 4.4-4.4 4.4H6.11c-.45 0-.88-.04-1.28-.13-.25-.04-.49-.11-.71-.19-1.5-.56-2.41-1.86-2.41-4.08V7.92c0-3.08 1.76-4.4 4.4-4.4h8.79c2.24 0 3.85.95 4.28 3.12.07.4.12.81.12 1.28Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M22.298 10.92v5.15c0 3.08-1.76 4.4-4.4 4.4h-8.79c-.74 0-1.41-.1-1.99-.32-1.19-.44-2-1.35-2.29-2.81.4.09.83.13 1.28.13h8.79c2.64 0 4.4-1.32 4.4-4.4V7.92c0-.47-.04-.89-.12-1.28 1.9.4 3.12 1.74 3.12 4.28Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.5 13.14a2.64 2.64 0 1 0 0-5.28 2.64 2.64 0 0 0 0 5.28Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M4.781 8.3v4.4M16.219 8.3v4.4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                    <span className="ml-2 mr-2 text-2xl font-bold text-[#003E48]">RWF {Number(product.price).toLocaleString()}</span>
                </div>

                <h2 className="text-xl font-bold text-[#003E48]">About this item</h2>

                <div className="my-4 text-[#003E48]/70">
                    <div
                        className={`prose prose-vitaway max-w-none overflow-hidden ${product.description.length > 200 && !isExpanded ? 'line-clamp-6' : ''}`}
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                    {product.description.length > 200 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 font-medium text-[#E85A2E] hover:underline"
                        >
                            {isExpanded ? 'See Less' : 'See More'}
                        </button>
                    )}
                </div>

                <div className="mb-6 flex w-full flex-col items-center justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <div className="mb-6 w-full sm:mb-0 sm:w-auto">
                        <label className="text-md font-bold text-[#003E48]">Quantity:</label>

                        <div className="mt-2 inline-flex items-center rounded-full bg-[#F6F3EE] sm:mt-5">
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                className="px-4 py-2 text-[#003E48] hover:text-[#003E48]/70 focus:outline-none"
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
                                className="w-16 border-0 bg-transparent px-3 py-1 text-center text-[#003E48] focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity < 10 ? quantity + 1 : 10)}
                                className="px-4 py-2 text-[#003E48] hover:text-[#003E48]/70 focus:outline-none">
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="w-full sm:w-auto">
                            <PressButton onClick={() => addToCart(product, quantity)} size="sm">
                                Add to Cart
                            </PressButton>
                        </div>
                        <div className="w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => buyNow()}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#003E48] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#003E48]/90 sm:w-auto"
                            >
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

        <CheckoutForm isOpen={isCheckoutOpen} onClose={closeCheckout} callback={handlePaymentCallback} />

        <AlertMessage message={message} type={messageType} />
    </>)
}

export default ProductDetails
