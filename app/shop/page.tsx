import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import ProductsList from './products-list';

export const metadata: Metadata = {
	title: 'Shop Now On Vitaway',
	description:
		'Explore a wide range of products at Vitaway. From healthcare essentials to wellness products, find everything you need to live a healthier life.',
	keywords: ['Vitaway', 'Shop', 'Healthcare', 'Wellness', 'Supplements', 'Medical Products'],
	openGraph: {
		title: 'Shop Now On Vitaway',
		description:
			'Explore a wide range of products at Vitaway. From healthcare essentials to wellness products, find everything you need to live a healthier life.',
		type: 'website',
		url: 'https://www.vitaway.org/shop',
		images: [
			{
				url: 'https://www.vitaway.org/images/shop-banner.jpg',
				width: 1200,
				height: 630,
				alt: 'Shop Banner',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Shop Now On Vitaway',
		description:
			'Explore a wide range of products at Vitaway. From healthcare essentials to wellness products, find everything you need to live a healthier life.',
		images: ['https://www.vitaway.org/images/shop-banner.jpg'],
	},
};

function Shop() {
	return (
		<>
			<GuestLayout>
				<ProductsList />
			</GuestLayout>
		</>
	);
}

export default Shop;