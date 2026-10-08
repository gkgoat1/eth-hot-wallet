import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Phase 5 (T5-1): vite build for the browser bundle, replacing webpack 3.
// React 15 retained (framework upgrade is Phase 6). Absolute imports
// (containers/, components/, utils/, vendor/) are preserved via resolve.alias
// so app source imports don't change during the port.
export default defineConfig({
  root: 'app',
  publicDir: 'public',
  resolve: {
    alias: {
      components: resolve(__dirname, 'app/components'),
      containers: resolve(__dirname, 'app/containers'),
      utils: resolve(__dirname, 'app/utils'),
      vendor: resolve(__dirname, 'app/vendor'),
      // react-intl was never a real dependency (i18n disabled); local stub
      // preserves the defineMessages/FormattedMessage surface the app uses.
      'react-intl': resolve(__dirname, 'app/utils/react-intl-stub.tsx'),
      // modernized packages
      '@eth-hot-wallet/web3-adapter': resolve(__dirname, 'packages/web3-adapter/src/index.ts'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  esbuild: {
    // React 15 JSX (React.createElement), not the automatic runtime.
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  build: {
    outDir: '../build',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
