'use client';

import React, { useEffect, useState } from 'react'
import ProductCard from '../components/cards/product-card';
import ProductCardSkeleton from '../components/cards/product-card-skeleton';
import Image from 'next/image';

function ProductsList() {
    const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const inventoryApiUrl = process.env.NEXT_PUBLIC_ENVENTORY_API_URL;

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);

				const response = await fetch(`${inventoryApiUrl}/products`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				setLoading(false);
				setProducts(data.data);
			} catch (error) {
				console.error('Error fetching products:', error);
			}
		};

		fetchProducts();
	}, [inventoryApiUrl]);

    return (<>
        <section className="bg-white">
            <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:py-20">
                <div className="flex flex-wrap">
                    <div className="w-full mb-6">
                        <h2 className="text-2xl text-slate-700 font-bold">Popular Products</h2>
                    </div>
                </div>

				{products.length === 0 && !loading && <div className="text-center flex items-center justify-center">
					<div className=''>
						<Image src='/svgs/exercise.svg' alt='blogs' width={300} height={300} />
						<span className='font-bold text-slate-700'>No Products Yet.</span>
					</div>
				</div>}

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:gap-3 xl:grid-cols-4">
					{loading 
						? Array(8).fill(0).map((_, index) => <ProductCardSkeleton key={index} />)
						: products.map((product, index) => (<ProductCard key={index} product={product} />))}
                </div>
            </div>
        </section>
    </>)
}

export default ProductsList;