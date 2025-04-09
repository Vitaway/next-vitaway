/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import GuestLayout from "@/app/layouts/GuestLayout";
import { Products } from "@/types/products";
import Head from "next/head";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

const ProductDetails: React.FC = () => {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [product, setProduct] = useState<Products | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            const fetchBlog = async () => {
                try {
                    const res = await fetch(`http://127.0.0.1:8000/api/products/${slug}`);

                    if (!res.ok) {
                        throw new Error('Blog not found');
                    }

                    const data = await res.json();

                    setProduct(data.data);
                    setLoading(false);
                } catch (error) {
                    setProduct(null);
                    setLoading(false);
                }
            };

            fetchBlog();
        }
    }, [slug]);

    if (loading) {
        return (
            <GuestLayout>
                <div className="min-h-[300px] flex items-center justify-center text-gray-800 text-lg">Loading...</div>
            </GuestLayout>
        );
    }

    if (!product) {
        return notFound();
    }

    return (
        <GuestLayout>
          <Head>
            <title>{product.name} | Product Details</title>
            <meta name="description" content={`Read "${product.name}"`} />
          </Head>

          {product.name}
        </GuestLayout>
    );
}

export default ProductDetails;