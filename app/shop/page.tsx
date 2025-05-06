import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import ProductsList from './products-list';

export const metadata: Metadata = {
	title: 'Shop Now',
	description:
		'Explore a wide range of products at Vitaway. From healthcare essentials to wellness products, find everything you need to live a healthier life.',
	keywords: ['Vitaway', 'Shop', 'Healthcare', 'Wellness', 'Supplements', 'Medical Products', 'vitaway health ltd', 'vitaway health', 'health rwanda'],
	metadataBase: new URL('https://www.vitaway.org/shop'),
	openGraph: {
		title: 'Shop Now',
		description:
			'Explore a wide range of products at Vitaway. From healthcare essentials to wellness products, find everything you need to live a healthier life.',
		type: 'website',
		url: new URL('https://www.vitaway.org/shop'),
		images: [
			{
				url: "https://vitaway.com/images/vitaway-logo.png",
				width: 1200,
				height: 630,
				alt: "Vitaway Logo",
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Shop Now',
		description:
			'Explore a wide range of products at Vitaway. From healthcare essentials to wellness products, find everything you need to live a healthier life.',
		images: ["https://vitaway.com/images/vitaway-logo.png"],
	},
};

function Shop() {
	return (
		<GuestLayout>
			<ProductsList />
		</GuestLayout>
	);
}

export default Shop;