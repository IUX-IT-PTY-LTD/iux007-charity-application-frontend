"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BlogPage = () => {
  const [blogs] = useState([
    {
      id: 1,
      title: "Supporting Education in Rural Communities",
      excerpt: "How our initiatives are helping bring quality education to underserved areas",
      image: "/assets/img/blog/education.jpg",
      date: "March 15, 2024",
      author: "John Smith",
      category: "Education"
    },
    {
      id: 2,
      title: "Clean Water Projects: Making a Difference",
      excerpt: "Progress report on our clean water initiatives in developing regions",
      image: "/assets/img/blog/water.jpg",
      date: "March 12, 2024",
      author: "Sarah Johnson",
      category: "Healthcare"
    },
    {
      id: 3,
      title: "Building Homes, Building Hope",
      excerpt: "Stories of families benefiting from our housing projects",
      image: "/assets/img/blog/housing.jpg",
      date: "March 10, 2024",
      author: "Michael Brown",
      category: "Housing"
    }
  ]);

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest news, success stories, and insights about our charitable initiatives around the world.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="relative h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-sm text-primary font-medium">{blog.category}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{blog.date}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  <Link href={`/blog/${blog.id}`} className="hover:text-primary transition-colors duration-300">
                    {blog.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {blog.author.charAt(0)}
                    </span>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">{blog.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 border border-primary bg-primary text-white rounded-md text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;