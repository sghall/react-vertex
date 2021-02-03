module.exports = {
  env: {
    cjs: {
      presets: [
        '@babel/preset-react',
        ['@babel/preset-env', { modules: 'commonjs' }],
      ],
      plugins: [
        'glsl',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-transform-runtime',
      ],
    },
    esm: {
      presets: [
        '@babel/preset-react',
        ['@babel/preset-env', { modules: false }],
      ],
      plugins: [
        'glsl',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-transform-runtime',
      ],
    },
    docs: {
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead',
          },
        ],
      ],
      plugins: [
        'glsl',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-transform-runtime',
      ],
    },
  },
}
