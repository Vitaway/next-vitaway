import GuestLayout from '../layouts/GuestLayout'
import BackgroundBlurImage from '../components/design/background-blur-image'
import ProductsList from './products-list';

function Shop() {
	return (
		<GuestLayout>
			<div className="bg-gradient-to-b from-[#272749] to-[#111827] relative">
				<div className="absolute inset-0 z-1 bg-gray-900/90"></div>

				<div className={`z-[5] absolute left-1/2 top-0 aspect-[1204/394] w-full max-w-[1204px] -translate-x-1/2`}>
					<BackgroundBlurImage />
				</div>

				<div className="relative z-10 px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
					<div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
						<div>
							<p className="inline-block  font-normal px-3 py-px mb-4 text-xs tracking-wider text-gray-300 uppercase rounded-full bg-teal-accent-400">
								Shop Now
							</p>
						</div>
						<h2 className="max-w-lg font-semibold my-6 text-3xl leading-none tracking-tight text-white sm:text-4xl md:mx-auto">
							<span className="relative inline-block">
								<svg viewBox="0 0 52 24" fill="currentColor" className="absolute top-9 -right-1 z-0 hidden w-28 -mt-8 -ml-20 text-blue-gray-100 lg:w-28 lg:-ml-28 lg:-mt-10 sm:block">
									<defs>
										<pattern id="18302e52-9e2a-4c8e-9550-0cbb21b38e55" x="0" y="0" width=".135" height=".30">
											<circle cx="1" cy="1" r=".7"></circle>
										</pattern>
									</defs>
									<rect fill="url(#18302e52-9e2a-4c8e-9550-0cbb21b38e55)" width="52" height="24"></rect>
								</svg>
							</span>

							Shop Now
						</h2>
						<p className="text-base text-gray-300 md:text-lg font-normal">
							Discover our exclusive collection of products tailored to meet your needs. From everyday nutritional to premium items, find everything you need in one place.
						</p>
						<div className="bg-green-400/50 w-full px-5 py-2 mt-5 rounded-3xl text-sm">
							<p>Free delivery anywhere for order above 50K in kigali</p>
						</div>
					</div>
				</div>
			</div>

			{/* Product List */}
			<ProductsList />
		</GuestLayout>
	)
}

export default Shop