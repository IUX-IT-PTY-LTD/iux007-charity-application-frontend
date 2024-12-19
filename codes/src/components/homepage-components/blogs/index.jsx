import Image from "next/image";
import React from "react";

const Blogs = () => {
  const blogs = [
    {
      id: 1,
      banner: "/assets/img/blog.jpg",
      title: "A Guide to Igniting Your Imagination",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan, nunc et tempus blandit, metus mi consectetur felis turpis vitae ligula.",
      date: "10 FEB 2023",
      author: "John Doe",
    },
    {
      id: 2,
      banner: "/assets/img/blog.jpg",
      title: "A Guide to Igniting Your Imagination",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan, nunc et tempus blandit, metus mi consectetur felis turpis vitae ligula.",
      date: "10 FEB 2023",
      author: "John Doe",
    },
    {
      id: 3,
      banner: "/assets/img/blog.jpg",
      title: "A Guide to Igniting Your Imagination",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan, nunc et tempus blandit, metus mi consectetur felis turpis vitae ligula.",
      date: "10 FEB 2023",
      author: "John Doe",
    },
    {
      id: 4,
      banner: "/assets/img/blog.jpg",
      title: "A Guide to Igniting Your Imagination",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan, nunc et tempus blandit, metus mi consectetur felis turpis vitae ligula.",
      date: "10 FEB 2023",
      author: "John Doe",
    },
  ];
  return (
    <div className="bg-gray-100 mx-auto py-20">
      <div className="mx-auto container">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-primary after:rounded-full">
            OUR LATEST BLOGS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-lg:max-w-3xl max-md:max-w-md mx-auto">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300"
            >
              <Image
                src={blog.banner}
                alt="Blog Post 1"
                className="w-full h-60 object-cover"
                width={300}
                height={200}
              />
              <div className="p-6">
                <span className="text-sm block text-gray-400 mb-2">
                  {blog.date} | BY {blog.author}
                </span>
                <h3 className="text-xl font-bold text-gray-800">
                  {blog.title}
                </h3>
                <hr className="my-4" />
                <p className="text-gray-400 text-sm">{blog.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
