// rollup.config.js

/**
 * Copyright (c) Tom Weatherhead. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
	input: './dist/lib/main.js',
	output: [
		{
			file: 'dist/a-star-heuristic-search.cjs.js',
			format: 'cjs',
			exports: 'named'
		},
		{
			file: 'dist/a-star-heuristic-search.esm.js',
			format: 'es',
			esModule: true,
			compact: true,
			plugins: [terser()]
		}
		// ,
		// {
		// 	file: 'dist/a-star-heuristic-search.js',
		// 	name: 'a-star-heuristic-search',
		// 	format: 'umd',
		// 	compact: true,
		// 	plugins: [terser()]
		// }
	],
	// context: 'window'
	context: 'this',
	plugins: [nodeResolve()]
};
