/** @type {import('next').NextConfig} */
const nextConfig = {
  // Portrait uploads are capped at 2 MB, plus room for the form encoding.
  experimental: {
    serverActions: { bodySizeLimit: '2.2mb' },
  },
  // The old Vampire-only dashboard moved into the cross-game vault.
  async redirects() {
    return [
      { source: '/dashboard', destination: '/vault/vampire', permanent: true },
      { source: '/dashboard/characters', destination: '/vault/vampire/characters', permanent: true },
      { source: '/dashboard/dice', destination: '/vault/vampire/dice', permanent: true },
      { source: '/dashboard/sheets/:path*', destination: '/vault/new', permanent: true },
    ];
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                        // Keep ids unique across inline SVGs (see scripts/svgo.config.mjs).
                        cleanupIds: false,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
