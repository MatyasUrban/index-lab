/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    // Add environment variables that should be available to the client
    env: {
        // We're not exposing DATABASE_URL to the client for security reasons
        // Add any client-side env vars here if needed
    },
};

export default nextConfig;
