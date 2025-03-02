import createMdx from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

const withMdx = createMdx({});

export default withMdx(nextConfig);
