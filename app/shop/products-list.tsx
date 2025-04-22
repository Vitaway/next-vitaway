'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../components/cards/product-card';
import ProductCardSkeleton from '../components/cards/product-card-skeleton';
import Image from 'next/image';
import { Products } from '@/types/products';

function ProductsList() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const inventoryApiUrl = process.env.NEXT_PUBLIC_ENVENTORY_API_URL;
	const [searchQuery, setSearchQuery] = useState('');

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
				setFilteredProducts(data.data); // Initialize filtered products
			} catch (error) {
				console.error('Error fetching products:', error);
			}
		};

		fetchProducts();
	}, [inventoryApiUrl]);

	// Filter products based on search query
	useEffect(() => {
		const filtered = products.filter((product: Products) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.price.toString().includes(searchQuery) ||
			product.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredProducts(filtered);
	}, [searchQuery, products]);

	return (
		<>
			<section className="bg-white">
				<div className="px-4 pb-20 pt-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-10 lg:pb-20 lg:pt-10">
					<div className="flex flex-wrap">
						<div className="w-full mb-6">
							<h2 className="text-2xl text-slate-700 font-bold">Popular Products</h2>
						</div>
					</div>

					<div className="bg-transparent rounded-lg flex flex-wrap gap-4 items-center mb-7">
						<div className="flex items-center w-full md:w-auto flex-col md:flex-row justify-center">
							<div className="border border-gray-300 rounded-full px-4 py-3 w-full md:w-[500px] text-sm focus:outline-none flex items-center bg-white">
								<span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M11 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
											stroke="#697689"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										></path>
										<path
											opacity=".4"
											d="M18.93 20.689c.53 1.6 1.74 1.76 2.67.36.85-1.28.29-2.33-1.25-2.33-1.14-.01-1.78.88-1.42 1.97Z"
											stroke="#697689"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										></path>
									</svg>
								</span>

								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search different products... (press enter to search)"
									className="border-none outline-none focus:border-none focus:outline-none ml-3 text-slate-700 bg-white w-full h-full placeholder:text-gray-400"
								/>
							</div>
						</div>
					</div>

					{filteredProducts.length === 0 && !loading && (
						<div className="text-center flex items-center justify-center">
							<div className="">
								<Image src="/svgs/exercise.svg" alt="blogs" width={300} height={300} />
								<span className="font-bold text-slate-700">No Products Found.</span>
							</div>
						</div>
					)}

					<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:gap-3 xl:grid-cols-4">
						{loading
							? Array(8)
								.fill(0)
								.map((_, index) => <ProductCardSkeleton key={index} />)
							: filteredProducts.map((product, index) => (
								<ProductCard key={index} product={product} />
							))}
					</div>
				</div>
			</section>
		</>
	);
}

export default ProductsList;