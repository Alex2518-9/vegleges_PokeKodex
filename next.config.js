/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    largePageDataBytes: 1 * 1024 * 1024 * 1024,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;
// {
//   async rewrites() {
//     return [
//       // Rewrite everything else to use `pages/index`
//       {
//         source: "/:path*",
//         destination: "/",
//       },
//     ];
//   },
// };
