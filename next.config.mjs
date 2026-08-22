/** @type {import('next').NextConfig} */
const nextConfig = {
  // If you had rewrites for your Express backend, they go inside here
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*' // (Change 5000 to whatever port your backend runs on if different)
      }
    ];
  }
};

export default nextConfig;