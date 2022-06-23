import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { join } from "path"
import { defineConfig } from "rollup"
import { terser } from "rollup-plugin-terser"
import typescript from "rollup-plugin-typescript2"

export default defineConfig({
	input: join("src/index.ts"),
	output: {
		dir: "dist",
		format: "cjs",
		generatedCode: "es5",
		plugins: [terser()],
	},
	plugins: [
		nodeResolve({ preferBuiltins: true }),
		json(),
		typescript(),
		commonjs(),
	],
})
