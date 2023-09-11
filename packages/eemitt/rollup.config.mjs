import { join, parse } from 'node:path';
import { defineConfig } from 'rollup';
import { typescript } from '@rollup/plugin-typescript';
import { empty } from 'rollup-plugin-empty';
import { filesize } from 'rollup-plugin-filesize';

function config(src, dist) {
  const { name } = parse(src);
  return defineConfig({
    input: src,
    plugins: [
      empty({
        dir: dist
      }),
      typescript({
        tsconfig: './tsconfig.build.json'
      }),
      filesize()
    ],
    output: [{
      file: join(dist, `${name}.esm.js`),
      format: 'esm',
      exports: 'auto'
    }, {
      file: join(dist, `${name}.js`),
      format: 'cjs',
      exports: 'auto',
      externalLiveBindings: false
    }]
  });
}

export default config('src/index.ts', 'dist');
