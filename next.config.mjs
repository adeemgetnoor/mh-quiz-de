/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000";
const assetPrefix = isProd ? `https://${vercelUrl}` : "";

const nextConfig = {
  assetPrefix: assetPrefix, // Serve assets from Vercel domain
  trailingSlash: true, // Ensure trailing slashes for all routes

  // Handle proxy routing
  async rewrites() {
    return {
      beforeFiles: [
        // Main quiz route maps to quiz page
        {
          source: "/a/quiz",
          destination: "/a/quiz",
          has: [
            {
              type: "host",
              value: "maharishiayurveda.nl",
            },
          ],
        },
        // API routes
        {
          source: "/a/quiz/api/:path*",
          destination: "/a/quiz/api/:path*",
          has: [
            {
              type: "host",
              value: "maharishiayurveda.nl",
            },
          ],
        },
        // Other routes under quiz
        {
          source: "/a/quiz/:path*",
          destination: "/a/quiz/:path*",
          has: [
            {
              type: "host",
              value: "maharishiayurveda.nl",
            },
          ],
        },
      ],
    };
  },

  // Ensure API routes work with CORS
  async headers() {
    return [
      {
        source: "/a/quiz/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
