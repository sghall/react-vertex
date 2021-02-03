const withImages = require('next-images')

module.exports = withImages({
  webpack: config => {
    return Object.assign({}, config, {
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          {
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: ['raw-loader', 'glslify-loader'],
          },
          {
            test: /\.(md)$/,
            exclude: /node_modules/,
            use: ['raw-loader'],
          },
        ]),
      }),
    })
  },
})
