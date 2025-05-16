/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: 'http://localhost:9094/api',
    NEXT_PUBLIC_API_VERSION: 'v1',
  },
};

export default nextConfig;
