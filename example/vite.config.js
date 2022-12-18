// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  build: {
    rollupOptions: {
      plugins: [
        // https://github.com/airbnb/lottie-web/issues/2599
        {
          name: 'disable-treeshake',
          transform(code, id) {
            if (/node_modules[/\\]lottie-web/.test(id)) {
              // Disable tree shake for lottie-web module
              return {
                code,
                map: null,
                moduleSideEffects: 'no-treeshake',
              };
            }
            return null;
          },
        },
      ],
    },
  },
});
