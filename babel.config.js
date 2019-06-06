const packageAliases = {
  '@react-vertex/core': './packages/core/src',
  '@react-vertex/geometry-hooks': './packages/geometry-hooks/src',
  '@react-vertex/material-hooks': './packages/material-hooks/src',
  '@react-vertex/orbit-camera': './packages/orbit-camera/src',
  '@react-vertex/scene-helpers': './packages/scene-helpers/src',
  '@react-vertex/color-hooks': './packages/color-hooks/src',
  '@react-vertex/math-hooks': './packages/math-hooks/src',
  '@react-vertex/dom-hooks': './packages/dom-hooks/src',
}

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
      presets: ['@babel/preset-react', ['@babel/preset-env', {
        targets: '> 0.25%, not dead'
      }]],
      plugins: [
        'glsl',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-transform-runtime',
        [
          'babel-plugin-module-resolver',
          {
            alias: {
              ...packageAliases,
              docs: './docs',
              pages: './pages',
              static: './static',
              packages: './packages',
              demos: './demos',
            },
          },
        ],
      ],
    },
  },
}
