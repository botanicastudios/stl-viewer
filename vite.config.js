import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    // Generate sourcemaps
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "src/stl-viewer.js"),
      name: "STLViewerLib",
      fileName: (format) => `stl-viewer${format === "es" ? "" : ".iife"}.js`,
      formats: ["es", "iife"],
    },
    rollupOptions: {
      output: [
        {
          format: "es",
          // ES module output - no intro needed
          manualChunks: undefined,
          // Define environment variable for this format
          intro: `
            if (typeof process === 'undefined') {
              window.process = { env: { ROLLUP_FORMAT: 'es' } };
            } else if (!process.env) {
              process.env = { ROLLUP_FORMAT: 'es' };
            } else {
              process.env.ROLLUP_FORMAT = 'es';
            }
          `,
        },
        {
          format: "iife",
          name: "STLViewerLib",
          // IIFE output - add intro to prevent duplicate registration
          manualChunks: undefined,
          intro: `
            // Define format environment variable
            if (typeof process === 'undefined') {
              window.process = { env: { ROLLUP_FORMAT: 'iife' } };
            } else if (!process.env) {
              process.env = { ROLLUP_FORMAT: 'iife' };
            } else {
              process.env.ROLLUP_FORMAT = 'iife';
            }
            
            // Skip registration if already defined
            if (typeof window !== 'undefined' && customElements.get('stl-viewer')) {
              console.log('STL Viewer already registered, skipping initialization');
              return;
            }
          `,
        },
      ],
    },
  },
});
