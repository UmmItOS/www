import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  ...(process.env.NEXT_DIST_DIR && { distDir: process.env.NEXT_DIST_DIR }),
  reactStrictMode: true,
  // Inlined at build. The home page revalidates hourly, so a runtime new Date() would show the regeneration time.
  env: { BUILD_TIME: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC' },
};

export default withMDX(config);
