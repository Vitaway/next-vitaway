export interface Products {
    id: number | string;
    name: string;
    slug: string;
    category: { 
        id?: number | string;
        name: string;
    };
    images: Array<{ image_url: string }>;
    price: string;
    description: string;
    quantity?: number | string;
}