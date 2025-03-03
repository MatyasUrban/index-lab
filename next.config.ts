import createMdx from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    // Add environment variables that should be available to the client
    env: {
        // We're not exposing DATABASE_URL to the client for security reasons
        // Add any client-side env vars here if needed
    },
};

const withMdx = createMdx({});

export default withMdx(nextConfig);
