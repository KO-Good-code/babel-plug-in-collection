import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import serve from '@rollup/plugin-serve';
import path from 'path';


export default {
  input: 'src/index.ts',
  output: {
    file: path.resolve(__dirname,'dist/index.js'),
    format: 'cjs',
    sourcemap: false,
    name: "addTryCatch"
  },
  plugins: [
    commonjs(),
    babel(),
    ts({
      tsconfig: path.resolve('../../tsconfig.json')
    }),
    nodeResolve({
      extensions: ['.js', '.ts']
    })
  ]
}