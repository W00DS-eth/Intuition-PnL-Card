import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress PURE annotation warnings from ox library
        if (warning.code === 'INVALID_ANNOTATION' && warning.message.includes('/*#__PURE__*/')) {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'wagmi-vendor': ['wagmi', 'viem', '@wagmi/core', '@wagmi/connectors'],
          'graphql-vendor': ['graphql', 'graphql-request'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  },
})