import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import ProductsList from './products-list';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';

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
			<PageHeader
				title={
					<>
						Clinic essentials you can take <span className="font-accent">home</span>
					</>
				}
				description="Supplements and wellness products we use in the plan — delivered in Kigali."
			/>

			<SectionCard className="bg-white py-12 sm:py-16">
				<div className="mx-auto max-w-[1440px] px-5 lg:px-12">
					<ProductsList />
				</div>
			</SectionCard>
		</GuestLayout>
	);
}

export default Shop;
