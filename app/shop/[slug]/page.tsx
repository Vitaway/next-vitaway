/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import AlertMessage from "@/app/components/alerts/alert-message";
import ImageSlider from "@/app/components/cards/images-slider";
import ProductCard from "@/app/components/cards/product-card";
import ProductCardSkeleton from "@/app/components/cards/product-card-skeleton";
import CheckoutForm from "@/app/components/forms/checkout-form";
import GuestLayout from "@/app/layouts/GuestLayout";
import { useCart } from "@/context/CartContext";
import { Products } from "@/types/products";
import Head from "next/head";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

const ProductDetails: React.FC = () => {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [product, setProduct] = useState<Products | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Products[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isCheckoutOpen, setOpenCheckout] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

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

    useEffect(() => {
        if (slug) {
            const fetchBlog = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/products/${slug}`);

                    if (!res.ok) {
                        throw new Error('Blog not found');
                    }

                    const data = await res.json();

                    setProduct(data.data.product);
                    setRelatedProducts(data.data.related_products);
                    setLoading(false);
                } catch (error) {
                    setProduct(null);
                    setLoading(false);
                }
            };

            fetchBlog();
        }
    }, [slug]);

    if (loading) {
        return (
            <GuestLayout>
                <div className="min-h-[300px] flex items-center justify-center text-gray-800 text-lg">Loading...</div>
            </GuestLayout>
        );
    }

    if (!product) {
        return notFound();
    }

    return (
        <GuestLayout>
            <Head>
                <title>{product.name} | Product Details</title>
                <meta name="description" content={`Read "${product.name}"`} />
            </Head>

            <div className="bg-white border-t border-gray-200">
                <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full md:w-1/2 px-4 mb-8">
                            <ImageSlider images={product.images.map((img) => img.image_url)} alt={product.name} />
                        </div>

                        <div className="w-full md:w-1/2 px-4">
                            <h2 className="text-3xl font-bold mb-2 text-slate-800">{product.name}</h2>
                            <p className="text-gray-600 mb-4">CAT: {product.category.name}</p>

                            <div className="mb-6">
                                <span className="text-2xl font-bold mr-2 text-slate-600">RWF {Number(product.price).toLocaleString()}</span>
                            </div>

                            <h2 className="font-bold text-xl text-slate-700">About this item</h2>
                            <p className="text-gray-700 my-4">{product.description}</p>

                            <div className="flex space-x-4 mb-6 items-center">
                                <div className="mb-6">
                                    <label className="font-bold text-md text-slate-700">Quantity:</label>
                                    <div className="flex items-center space-x-2 mt-5">
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
                                <div>
                                    <button onClick={() => addToCart(product, quantity)} className="bg-[#272749] hover:bg-[#272749]/90 cursor-pointer flex gap-2 items-center text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82" stroke="#ffffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".4" d="M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke="#ffffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        Add to Cart
                                    </button>
                                </div>
                                <button onClick={() => buyNow()} className="bg-[#272749] hover:bg-[#272749]/90 cursor-pointer flex gap-2 items-center text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82" stroke="#ffffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path opacity=".4" d="M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke="#ffffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {relatedProducts && relatedProducts.length > 2 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold text-slate-800">You may also Like</h2>

                            <div className="keen-slider">
                                {loading
                                    ? Array(8).fill(0).map((_, index) => (
                                        <div key={index} className="keen-slider__slide">
                                            <ProductCardSkeleton />
                                        </div>
                                    ))
                                    : relatedProducts.map((product, index) => (
                                        <div key={index} className="keen-slider__slide">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Checkout Form */}
            <CheckoutForm isOpen={isCheckoutOpen} onClose={closeCheckout} callback={handlePaymentCallback} />

            <AlertMessage message={message} type={messageType} />
        </GuestLayout>
    );
}

export default ProductDetails;