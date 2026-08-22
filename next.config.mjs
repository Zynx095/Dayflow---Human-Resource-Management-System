/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['gsap', '@gsap/react'],
  // If you had rewrites for your Express backend, they go inside here
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*' // Changed to 3001 to match backend
      }
    ];
  }
};

export default nextConfig;