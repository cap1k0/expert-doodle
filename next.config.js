/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Article cover images are served from Vercel Blob on the cms
    // domain — allow that host so next/image (if used later) and
    // plain <img> both work without extra config per image.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

module.exports = nextConfig;
