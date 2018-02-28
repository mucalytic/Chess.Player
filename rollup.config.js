import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default {
   input: "./chess-player.ts",
   output: {
      file: "./chess-player.min.js",
      format: "iife"
   },
   watch: {
      include: [
          "./chess-player.ts",
          "./src/*/*.ts",
          "./src/*.ts"
      ]
   },
   plugins: [
      typescript(),
      babel({
        babelrc: false,
        presets: [
            'es2015-rollup'
        ]
    }),
      uglify()
   ]
};
