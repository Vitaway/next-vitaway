export interface Blogs {
    id: string;
    title: string;
    images: Array<{ image_url: string }>;
    category: { name: string };
    created_at: string;
    content: string;
    caption: string;
    link: string;
    slug: string;
    author: string;
}