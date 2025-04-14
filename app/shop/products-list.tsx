'use client';

import React, { useEffect, useState } from 'react'
import ProductCard from '../components/cards/product-card';
import ProductCardSkeleton from '../components/cards/product-card-skeleton';
import Image from 'next/image';

function ProductsList() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const inventoryApiUrl = process.env.NEXT_PUBLIC_ENVENTORY_API_URL;
	const [searchQuery, setSearchQuery] = useState('');
	const [category, setCategory] = useState('');

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);

				const response = await fetch(`${inventoryApiUrl}/api/products`);
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

				<div className="bg-transparent rounded-lg flex flex-wrap gap-4 items-center mb-7">
					<div className="flex items-center w-full md:w-auto flex-col md:flex-row justify-center">
						<div className='border border-gray-300 rounded-full px-4 py-3 w-full md:w-[500px] text-sm focus:outline-none flex items-center bg-white'>
							<span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path opacity=".4" d="M18.93 20.689c.53 1.6 1.74 1.76 2.67.36.85-1.28.29-2.33-1.25-2.33-1.14-.01-1.78.88-1.42 1.97Z" stroke="#697689" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>

							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={() => {}}
								placeholder="Search different products... (press enter to search)"
								className="border-none outline-none focus:border-none focus:outline-none ml-3 text-slate-700 bg-white w-full h-full placeholder:text-gray-400"
							/>
						</div>
						<div className='flex items-center justify-center mt-2 md:mt-0'>
							<div className='border border-gray-300 rounded-full px-4 py-3 w-full md:w-[200px] text-sm focus:outline-none flex items-center bg-white md:ml-2'>
								<span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path stroke="#697689" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 9v6c0 2.5-.5 4.25-1.62 5.38L14 14l7.73-7.73c.18.79.27 1.69.27 2.73z"></path><path stroke="#697689" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.73 6.27L6.27 21.73C3.26 21.04 2 18.96 2 15V9c0-5 2-7 7-7h6c3.96 0 6.04 1.26 6.73 4.27z"></path><path stroke="#697689" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.38 20.38C19.25 21.5 17.5 22 15 22H9c-1.04 0-1.94-.09-2.73-.27L14 14l6.38 6.38z"></path><path stroke="#697689" strokeWidth="1.5" d="M6.24 7.98c.68-2.93 5.08-2.93 5.76 0 .39 1.72-.69 3.18-1.64 4.08a1.8 1.8 0 01-2.48 0c-.95-.9-2.04-2.36-1.64-4.08z" opacity=".4"></path><path stroke="#697689" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.094 8.7h.01" opacity=".4"></path></svg></span>

								<input
									type="text"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									onKeyDown={() => { }}
									placeholder="Location"
									className="border-none outline-none focus:border-none placeholder:text-gray-400 text-slate-700 focus:outline-none ml-3 bg-white w-full h-full"
								/>
							</div>
						</div>
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