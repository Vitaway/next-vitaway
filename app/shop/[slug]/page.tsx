import GuestLayout from "@/app/layouts/GuestLayout";
import { notFound } from "next/navigation";
import { Products } from "@/types/products";
import ProductDetails from "./ProductDetails";

interface ProductResponse {
    data: {
        product: Products;
        related_products: Products[];
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
