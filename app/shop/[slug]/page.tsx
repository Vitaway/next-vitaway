import GuestLayout from "@/app/layouts/GuestLayout";
import { notFound } from "next/navigation";
import { Products } from "@/types/products";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";

interface ProductResponse {
    data: {
        product: Products;
        related_products: Products[];
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/products/${slug}`, {
        cache: "force-cache",
    });

    if (!res.ok) {
        return {
            title: "Product Not Found | Vitaway",
            description: "The product you are looking for does not exist.",
        };
    }

    const { data }: ProductResponse = await res.json();
    const product = data.product;

    return {
        title: `${product.name} | Product Details`,
        description: `Explore details about "${product.name}".`,
        openGraph: {
            title: `${product.name} | Product Details`,
            description: `Explore details about "${product.name}".`,
            url: `https://www.vitaway.org/shop/${slug}`,
            images: product.images.map((img) => ({
                url: img.image_url,
                width: 1200,
                height: 630,
                alt: product.name,
            })),
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.name} | Product Details`,
            description: `Explore details about "${product.name}".`,
            images: product.images.map((img) => img.image_url),
        },
    };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api/products/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return notFound();
    }

    const { data }: ProductResponse = await res.json();
    const product = data.product;
    const relatedProducts = data.related_products;

    return (
        <GuestLayout>
            <ProductDetails product={product} relatedProducts={relatedProducts} loading={false} />
        </GuestLayout>
    );
}
