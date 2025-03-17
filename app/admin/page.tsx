'use client';

import React, { useState } from 'react'
import FormModal from '../components/models/form-model'
import BlogForm from '../components/forms/blog.form'

function AdminDashboard() {
  const [isFormOpen, setFormOpen] = useState(false);

  return (<>
    <header>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-black">Manage Blogs</h1>

        <button onClick={() => setFormOpen(true)} className="bg-black text-white px-4 py-2 flex items-center rounded cursor-pointer">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          <span>Add New</span>
        </button>
      </div>

      <FormModal isOpen={isFormOpen} onClose={() => setFormOpen(false)}>
        <BlogForm />
      </FormModal>
    </header>
  </>)
}

export default AdminDashboard