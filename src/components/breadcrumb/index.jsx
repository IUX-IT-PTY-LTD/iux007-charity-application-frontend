'use client';
import Link from 'next/link';
import React from 'react';

const Breadcrumb = ({ title, links }) => {
  return (
    <div className="breadcrumb py-12">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-5">{title}</h2>
          <nav className="text-gray-500 font-semibold text-[15px]">
            <ol className="list-none p-0 inline-flex">
              {links.map((link, index) => (
                <React.Fragment key={index}>
                  <li
                    className={`max-lg:border-b border-gray-300 max-lg:py-3 px-3 ${
                      link.active ? 'active' : ''
                    }`}
                  >
                    <Link
                      href={link.href}
                      className="hover:text-primary text-gray-500 block font-semibold text-[15px]"
                    >
                      {link.title}
                    </Link>
                  </li>
                  {index < links.length - 1 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-gray-400 w-3.5 -rotate-90 mx-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                        clipRule="evenodd"
                        data-original="#000000"
                      ></path>
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
