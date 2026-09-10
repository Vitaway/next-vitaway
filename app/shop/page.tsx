import { Metadata } from 'next';
import GuestLayout from '../layouts/GuestLayout';
import ProductsList from './products-list';
import PageHeader from '../components/headers/page-header';
import SectionCard from '../components/sections/section-card';
import { Construction } from 'lucide-react';

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

			<div className="relative z-10 -mt-1 px-5 lg:px-10">
				<div className="mx-auto flex max-w-[1440px] items-start gap-3 rounded-[22px] border border-[#E85A2E]/25 bg-[#FFF4F0] px-5 py-4 text-[#003E48] shadow-[0_10px_30px_rgba(0,62,72,0.08)] sm:items-center sm:rounded-[28px] sm:px-6">
					<span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E85A2E] text-white sm:mt-0">
						<Construction className="h-5 w-5" aria-hidden />
					</span>
					<div>
						<p className="text-base font-bold text-[#003E48]">Shop under construction</p>
						<p className="mt-1 text-sm leading-relaxed text-[#003E48]/70">
							We are finishing the catalogue and delivery setup. You can still browse — checkout may be limited until we reopen fully.
						</p>
					</div>
				</div>
			</div>

			<SectionCard className="bg-white py-12 sm:py-16">
				<div className="mx-auto max-w-[1440px] px-5 lg:px-12">
					<ProductsList />
				</div>
			</SectionCard>
		</GuestLayout>
	);
}

export default Shop;
