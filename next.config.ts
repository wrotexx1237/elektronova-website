import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      { source: '/sherbimet', destination: '/sq/sherbimet', permanent: true },
      { source: '/blogu', destination: '/sq/blogu', permanent: true },
      { source: '/blogu/:slug', destination: '/sq/blogu/:slug', permanent: true },
      { source: '/rreth-nesh', destination: '/sq/rreth-nesh', permanent: true },
      { source: '/elektricist-:id', destination: '/sq/elektricist-:id', permanent: true },
      { source: '/portofolio', destination: '/sq/portofolio', permanent: true },
      { source: '/sq/services/:slug', destination: '/sq/sherbimet/:slug', permanent: true },
      { source: '/en/blog/rendesia-e-alarmit-wireless', destination: '/en/blog/importance-of-wireless-alarms', permanent: true },
      { source: '/sq/blogu/5-common-security-camera-mistakes', destination: '/sq/blogu/5-gabime-kamera-sigurie', permanent: true },
      { source: '/en/blog/energjia-solare-elektrike', destination: '/en/blog/solar-energy-kosovo-guide', permanent: true },
      { source: '/sq/blogu/security-camera-installation-cost-kosovo', destination: '/sq/blogu/sa-kushton-instalimi-i-kamerave-te-sigurise-ne-kosove', permanent: true },
      { source: '/en/services/sistemet-nvr-dvr', destination: '/en/services/nvr-dvr-systems', permanent: true },
      { source: '/sq/services/instalim-ndricimi', destination: '/sq/sherbimet/instalim-ndricimi', permanent: true },

      // Redirect errors (Cross-language pathways blocked by 307 temporary redirects)
      { source: '/sq/locations/:slug', destination: '/sq/elektricist-:slug', permanent: true },
      { source: '/sq/about', destination: '/sq/rreth-nesh', permanent: true },
      { source: '/en/rreth-nesh', destination: '/en/about', permanent: true },
      { source: '/en/elektricist-:id', destination: '/en/electrician-:id', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
 
export default withNextIntl(nextConfig);

