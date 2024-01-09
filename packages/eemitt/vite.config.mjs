import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const externals = Object.keys(pkg.dependencies).map((n) => new RegExp(`^${n}/?`));

export default defineConfig({
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json'
    })
  ],
  build: {
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index${format === 'cjs' ? '' : `.${format}`}.js`
    },
    rollupOptions: {
      external: externals,
      output: {
        generatedCode: 'es5'
      }
    }
  },
  test: {
    name: 'emit',
    dir: './test',
    environment: 'node'
  }
});
