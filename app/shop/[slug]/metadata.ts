import { Metadata } from "next";
import { Products } from "@/types/products";

interface ProductResponse {
  data: {
    product: Products;
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

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
