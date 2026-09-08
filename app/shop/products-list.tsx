'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../components/cards/product-card';
import Image from 'next/image';
import { Products } from '@/types/products';
import AlertMessage from '../components/alerts/alert-message';
import { useProducts, useCategories } from '@/hooks';
import { InlineSpinner } from '@/app/components/spinners';
import Pagination from '../components/pagination';

const ProductsList = React.memo(function ProductsList() {
	const { products, loading: productsLoading, error: productsError } = useProducts();
	const { categories, loading: categoriesLoading } = useCategories();

	const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [sortBy, setSortBy] = useState('name-desc');
	const [currentPage, setCurrentPage] = useState(1);

	const loading = productsLoading || categoriesLoading;
	const itemsPerPage = 12;

	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	useEffect(() => {
		let filtered = products.filter((product: Products) => {
			// Filter by selected category
			if (selectedCategory && product.category?.id?.toString() !== selectedCategory) {
				return false;
			}

			// Filter by search query
			if (searchQuery) {
				return (
					product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.price.toString().includes(searchQuery) ||
					product.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
				);
			}

			return true;
		});

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
	}, [searchQuery, products, sortBy, selectedCategory]);

	const from = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
	const to = Math.min(currentPage * itemsPerPage, filteredProducts.length);

	return (
		<>
			<div className="space-y-4">
				<div className="relative">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
						<svg className="h-5 w-5 text-[#003E48]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search different products... (press enter to search)"
						className="w-full rounded-full bg-[#F6F3EE] py-3 pl-12 pr-4 text-[#003E48] placeholder:text-[#003E48]/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#003E48]"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery('')}
							className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#003E48]/40 hover:text-[#003E48]"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>

				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<div className="flex flex-wrap items-center gap-2">
						<span className="mr-2 text-sm font-semibold text-[#003E48]">Category:</span>
						<button
							type="button"
							onClick={() => handleCategoryChange('')}
							className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
								selectedCategory === ''
									? 'bg-[#003E48] text-white'
									: 'bg-[#F6F3EE] text-[#003E48] hover:bg-[#E8F7F4]'
							}`}
						>
							All Products
						</button>
						{categories.map((category: { name: string; id: string | number }) => (
							<button
								key={category.id}
								type="button"
								onClick={() => handleCategoryChange(String(category.id))}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
									selectedCategory === String(category.id)
										? 'bg-[#003E48] text-white'
										: 'bg-[#F6F3EE] text-[#003E48] hover:bg-[#E8F7F4]'
								}`}
							>
								{category.name}
							</button>
						))}
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-[#003E48]">Sort by:</span>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="rounded-full bg-[#F6F3EE] px-4 py-2 text-sm font-medium text-[#003E48] focus:outline-none"
						>
							<option value="name-desc">Name (Z-A)</option>
							<option value="name-asc">Name (A-Z)</option>
							<option value="price-desc">Price (High-Low)</option>
							<option value="price-asc">Price (Low-High)</option>
						</select>
					</div>
				</div>

				<div className="flex items-center justify-between text-sm text-[#003E48]/60">
					<span>
						Showing <strong className="text-[#003E48]">{filteredProducts.length}</strong> products
					</span>
					{(searchQuery || selectedCategory) && (
						<button
							type="button"
							onClick={() => {
								setSearchQuery('');
								setSelectedCategory('');
							}}
							className="font-medium text-[#E85A2E] hover:underline"
						>
							Clear all filters
						</button>
					)}
				</div>
			</div>

			{filteredProducts.length === 0 && !loading && (
				<div className="mt-10 flex items-center justify-center text-center">
					<div>
						<Image src="/svgs/exercise.svg" alt="blogs" width={300} height={300} />
						<span className="font-bold text-[#003E48]">No Products Found.</span>
					</div>
				</div>
			)}

			{loading ? (
				<div className="mt-10">
					<InlineSpinner message="Loading products..." />
				</div>
			) : (
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
					{paginatedProducts.map((product, index) => (
						<ProductCard key={index} product={product} />
					))}
				</div>
			)}

			{!loading && filteredProducts.length > 0 && (
				<Pagination
					currentPage={currentPage}
					lastPage={totalPages}
					total={filteredProducts.length}
					from={from}
					to={to}
					onPageChange={handlePageChange}
					loading={loading}
				/>
			)}

			{productsError && <AlertMessage message={productsError} type="error" />}
		</>
	);
});

export default ProductsList;
