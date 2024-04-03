// next.config.mjs
export default {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "**", // Optional: You can specify a specific path if needed
      },
    ],
  },
};
