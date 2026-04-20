import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      include: ['**/*.ts', '**/*.tsx'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        'antd',
        /^antd\/.*/,
        '@ant-design/icons',
        /^@ant-design\/.*/,
        'zustand',
        /^zustand\/.*/,
        'axios',
        '@directo/template-builder',
        /^@directo\/.*/,
      ],
      output: {
        assetFileNames: 'style[extname]',
      },
    },
  },
})
