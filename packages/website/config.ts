import { createMuiTheme } from '@material-ui/core/styles'

export const repoPath = 'https://github.com/sghall/react-vertex'
export const docsPath = `${repoPath}/tree/master/packages/website`

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#5b5c5e',
      main: '#323334',
      dark: '#0a0c0d',
      contrastText: '#fff',
    },
    secondary: {
      light: '#75e0e3',
      main: '#3daeb1',
      dark: '#007e82',
      contrastText: '#fff',
    },
  },
})

export const demosList = [
  {
    href: '/demo-axes-helper',
    name: 'Axes Helper',
    tag: '',
  },
  {
    href: '/demo-tuna-wireframe',
    name: 'Tuna Wireframe',
    tag: '',
  },
  {
    href: '/demo-shark-week',
    name: 'Shark Week',
    tag: '',
  },
  {
    href: '/demo-curl-noise-particles',
    name: 'Curl Noise Particles',
    tag: '',
  },
  {
    href: '/demo-flocking-birds',
    name: 'Flocking Birds',
    tag: '',
  },
  {
    href: '/demo-texture-cubes',
    name: 'Texture Cubes',
    tag: '',
  },
  {
    href: '/demo-attenuated-light',
    name: 'Attenuated Light',
    tag: '',
  },
  {
    href: '/demo-materials-explorer',
    name: 'Materials Explorer',
    tag: '',
  },
  {
    href: '/demo-point-lights-lambert',
    name: 'Point Lights w/ Lambert',
    tag: '',
  },
  {
    href: '/demo-point-lights-phong',
    name: 'Point Lights w/ Phong',
    tag: '',
  },
]

export const docsList = [
  {
    href: '/',
    name: 'Home',
    tag: 'Introduction',
  },
  {
    href: '/docs-core-hooks',
    name: 'React Vertex Core',
    tag: 'Canvas, elements, hooks',
  },
  {
    href: '/docs-geometry-hooks',
    name: 'Geometry Hooks',
    tag: 'Standalone Package',
  },
  {
    href: '/docs-material-hooks',
    name: 'Material Hooks',
    tag: 'Standalone Package',
  },
  {
    href: '/docs-light-hooks',
    name: 'Light Hooks',
    tag: 'Included in core',
  },
  {
    href: '/docs-scene-helpers',
    name: 'Scene Helpers',
    tag: 'Standalone Package',
  },
  {
    href: '/docs-shader-hooks',
    name: 'Shader Hooks',
    tag: 'Included in core',
  },
  {
    href: '/docs-buffer-hooks',
    name: 'Buffer Hooks',
    tag: 'Included in core',
  },
  {
    href: '/docs-framebuffer-hooks',
    name: 'Framebuffer Hooks',
    tag: 'Included in core',
  },
  {
    href: '/docs-attribute-hooks',
    name: 'Attribute Hooks',
    tag: 'Included in core',
  },
  {
    href: '/docs-uniform-hooks',
    name: 'Uniform Hooks',
    tag: 'Included in core',
  },
  {
    href: '/docs-texture-hooks',
    name: 'Texture Hooks',
    tag: 'Included in core',
  },
  {
    href: '/docs-matrix-hooks',
    name: 'Matrix Hooks',
    tag: 'Part of math-hooks',
  },
  {
    href: '/docs-vector-hooks',
    name: 'Vector Hooks',
    tag: 'Part of math-hooks',
  },
  {
    href: '/docs-color-hooks',
    name: 'Color Hooks',
    tag: 'Standalone Package',
  },
  {
    href: '/docs-orbit-camera',
    name: 'Orbit Camera',
    tag: 'Standalone Package',
  },
]
