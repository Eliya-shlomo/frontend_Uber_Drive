/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      ALCHEMY_URL: process.env.ALCHEMY_URL,
    },
  };
  
  export default nextConfig;