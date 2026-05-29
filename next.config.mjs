import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isExport = process.env.EXPORT === 'true';

/** @type {import('next').NextConfig} */
const config = {
  ...(isExport && { output: 'export' }),
  ...(isExport && { basePath: '/www' }),
  ...(isExport && { assetPrefix: '/www/' }),
  ...(process.env.NEXT_DIST_DIR && { distDir: process.env.NEXT_DIST_DIR }),
  reactStrictMode: true,
};

export default withMDX(config);
