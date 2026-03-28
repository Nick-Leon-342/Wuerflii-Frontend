

import path from 'path'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'





// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(), 
		react(),
		svgr(), 
	],
	resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
