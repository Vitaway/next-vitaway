"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBlog() {
    const [form, setForm] = useState({ title: "", content: "", image: "", author: "" });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/blogs", {
            method: "POST",
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json" },
        });
        router.push("/blog");
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-4">Add New Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Content"
                    className="w-full p-2 border rounded"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    className="w-full p-2 border rounded"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Author"
                    className="w-full p-2 border rounded"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Publish Blog
                </button>
            </form>
        </div>
    );
}
