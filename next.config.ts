import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    additionalData:
      '@use "@/styles/variable.scss" as *; @use "@/styles/mixin.scss" as *;'
  }
};

export default nextConfig;
