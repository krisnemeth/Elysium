import path from 'node:path';

const config = {
  multipass: true,
  plugins: [
    { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
    'removeDimensions',
    'removeXMLNS',
    // Unique ids per file: several of these SVGs render inline on one page,
    // and pdftocairo's generic clip-path ids would otherwise collide.
    {
      name: 'prefixIds',
      params: {
        prefix: (_, info) =>
          path
            .relative('app/ui/svgs/official', info.path)
            .replace(/\.svg$/, '')
            .replace(/[^a-z0-9]+/gi, '-'),
      },
    },
  ],
};

export default config;
