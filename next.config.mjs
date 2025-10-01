/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: 'http://localhost:9094/api',
    NEXT_PUBLIC_API_VERSION: 'v1',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iux007-charity-application.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
