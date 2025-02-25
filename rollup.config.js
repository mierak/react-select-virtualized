import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import replace from 'rollup-plugin-replace';
import gzipPlugin from 'rollup-plugin-gzip';
import cleaner from 'rollup-plugin-cleaner';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      compact: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      compact: true,
      exports: 'named',
    },
  ],
  plugins: [
    external(),
    postcss({
      minimize: isProd,
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    }),
    commonjs(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    gzipPlugin(),
    isProd &&
      cleaner({
        targets: ['./dist/'],
      }),
    isProd &&
      terser({
        sourcemap: true,
        toplevel: true,
      }),
  ],
};
