/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer, nextRuntime }) => {
        if (isServer && nextRuntime === 'nodejs') {
          config.resolve.alias = {
            ...config.resolve.alias,
            playht: 'playht/dist/cjs',
          };
        }
    
        return config;
      },
      images: {
        remotePatterns: [new URL('https://auptyxevnjmcppzuinjk.supabase.co/**')],
      },
};

export default nextConfig;
