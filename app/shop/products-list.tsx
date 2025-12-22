'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../components/cards/product-card';
import ProductCardSkeleton from '../components/cards/product-card-skeleton';
import Image from 'next/image';
import { Products } from '@/types/products';
import AlertMessage from '../components/alerts/alert-message';

function ProductsList() {
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [sortBy, setSortBy] = useState('name-desc');
	const [currentPage, setCurrentPage] = useState(1);
	const [message, setMessage] = useState<string>('');
	const [messageType, setMessageType] = useState<'success' | 'error'>('success');

	const inventoryApiUrl = process.env.NEXT_PUBLIC_ENVENTORY_API_URL;
	const itemsPerPage = 12;

	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const fetchProducts = React.useCallback(async () => {
		try {
			setLoading(true);

			const axios = (await import('axios')).default;

			const response = await axios.get(`${inventoryApiUrl}/api/products`, {
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
				params: selectedCategory ? { category: selectedCategory } : {}
			});

			setLoading(false);
			setProducts(response.data.data);
			setFilteredProducts(response.data.data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			setMessage("Failed to fetch Products, Try again later");
			setMessageType('error');
		}
	}, [inventoryApiUrl, selectedCategory]);

	const fetchCategories = React.useCallback(async () => {
		try {
			setLoading(true);

			const axios = (await import('axios')).default;

			const response = await axios.get(`${inventoryApiUrl}/api/products/categories/list`, {
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
			});

			setLoading(false);
			setCategories(response.data.data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			setMessage("Failed to fetch Categories, Try again later");
			setMessageType('error');
		}
	}, [inventoryApiUrl]);

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		fetchProducts();
	}
	useEffect(() => {
		fetchProducts();
		fetchCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inventoryApiUrl]);

	useEffect(() => {
		let filtered = products.filter((product: Products) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.price.toString().includes(searchQuery) ||
			product.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
		);

		filtered = filtered.sort((a: Products, b: Products) => {
			switch (sortBy) {
				case 'name-asc':
					return a.name.localeCompare(b.name);
				case 'name-desc':
					return b.name.localeCompare(a.name);
				case 'price-asc':
					return Number(a.price) - Number(b.price);
				case 'price-desc':
					return Number(b.price) - Number(a.price);
				default:
					return b.name.localeCompare(a.name);
			}
		});

		setFilteredProducts(filtered);
	}, [searchQuery, products, sortBy]);

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
						<div className="flex items-center w-full md:w-auto flex-col md:flex-row justify-center">
							<div className="border border-gray-300 rounded-full px-4 py-3 w-full md:w-[200px] text-sm focus:outline-none flex items-center bg-white">
								<select
									value={selectedCategory}
									onChange={(e) => handleCategoryChange(e.target.value)}
									className="border-none outline-none focus:border-none focus:outline-none ml-3 text-slate-700 bg-white w-full h-full placeholder:text-gray-400"
								>
									<option value="">All Products</option>

									{categories.map((category: { name: string; id: string; }) => (
										<option key={category.id} value={category.id}>{category.name}</option>
									))}
								</select>
							</div>
						</div>
						<div className="flex items-center w-full md:w-auto flex-col md:flex-row justify-center">
							<div className="border border-gray-300 rounded-full px-4 py-3 w-full md:w-[200px] text-sm focus:outline-none flex items-center bg-white">
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="border-none outline-none focus:border-none focus:outline-none ml-3 text-slate-700 bg-white w-full h-full placeholder:text-gray-400"
								>
									<option value="name-desc">Name (Z-A)</option>
									<option value="name-asc">Name (A-Z)</option>
									<option value="price-desc">Price (High-Low)</option>
									<option value="price-asc">Price (Low-High)</option>
								</select>
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

					<div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
						{loading
							? Array(itemsPerPage)
								.fill(0)
								.map((_, index) => <ProductCardSkeleton key={index} />)
							: paginatedProducts.map((product, index) => (
								<ProductCard key={index} product={product} />
							))}
					</div>

					<hr className='my-5' />

					<div className="flex justify-center items-center">
						<button
							className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded-full text-sm cursor-pointer"
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Previous
						</button>
						{Array.from({ length: totalPages }, (_, index) => (
							<button
								key={index}
								className={`px-4 py-2 mx-1 rounded-full text-sm cursor-pointer ${currentPage === index + 1 ? 'bg-[#003E48] text-white' : 'bg-gray-300 text-gray-700'}`}
								onClick={() => handlePageChange(index + 1)}
							>
								{index + 1}
							</button>
						))}
						<button
							className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded-full text-sm cursor-pointer"
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>

			</section>

			<AlertMessage message={message} type={messageType} />
		</>
	);
}

export default ProductsList;