/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
        remotePatterns: [new URL('https://auptyxevnjmcppzuinjk.supabase.co/**')],
      },
};

export default nextConfig;
