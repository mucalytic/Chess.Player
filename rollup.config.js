import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';

export default {
   input: "./chess-player.ts",
   output: {
      file: "./chess-player.min.js",
      format: "iife"
   },
   watch: {
      include: "./chess-player.ts"
   },
   plugins: [
      typescript(),
      buble(),
      uglify()
   ]
};
