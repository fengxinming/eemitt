import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import vitePluginExternal from 'vite-plugin-external';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json'
    }),
    vitePluginExternal({
      externalizeDeps: Object.keys(pkg.dependencies)
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
