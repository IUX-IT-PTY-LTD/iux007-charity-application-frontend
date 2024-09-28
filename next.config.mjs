// import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/img/:path*',
                destination: '/assets/img/:path*', // Adjust this path as per your folder structure
            },
        ];
    },
};

export default nextConfig;
