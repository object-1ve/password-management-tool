// vite.config.ts
import { defineConfig } from "file:///D:/000_download/all_in/project/electron-0331/node_modules/vite/dist/node/index.js";
import path from "node:path";
import electron from "file:///D:/000_download/all_in/project/electron-0331/node_modules/vite-plugin-electron/dist/simple.mjs";
import vue from "file:///D:/000_download/all_in/project/electron-0331/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\000_download\\all_in\\project\\electron-0331";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "electron/main.ts",
        vite: {
          build: {
            rollupOptions: {
              external: ["better-sqlite3"]
              // 在这里添加 better-sqlite3
            }
          }
        }
      },
      preload: {
        input: path.join(__vite_injected_original_dirname, "electron/preload.ts"),
        vite: {
          build: {
            rollupOptions: {
              external: ["better-sqlite3"]
              // 如果你在 preload 进程中也使用了 better-sqlite3，也需要添加
            }
          }
        }
      },
      renderer: process.env.NODE_ENV === "test" ? void 0 : {}
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFwwMDBfZG93bmxvYWRcXFxcYWxsX2luXFxcXHByb2plY3RcXFxcZWxlY3Ryb24tMDMzMVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcMDAwX2Rvd25sb2FkXFxcXGFsbF9pblxcXFxwcm9qZWN0XFxcXGVsZWN0cm9uLTAzMzFcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6LzAwMF9kb3dubG9hZC9hbGxfaW4vcHJvamVjdC9lbGVjdHJvbi0wMzMxL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBlbGVjdHJvbiBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBlbGVjdHJvbih7XG4gICAgICBtYWluOiB7XG4gICAgICAgIGVudHJ5OiAnZWxlY3Ryb24vbWFpbi50cycsXG4gICAgICAgIHZpdGU6IHtcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICBleHRlcm5hbDogWydiZXR0ZXItc3FsaXRlMyddLCAvLyBcdTU3MjhcdThGRDlcdTkxQ0NcdTZERkJcdTUyQTAgYmV0dGVyLXNxbGl0ZTNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcmVsb2FkOiB7XG4gICAgICAgIGlucHV0OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZWxlY3Ryb24vcHJlbG9hZC50cycpLFxuICAgICAgICB2aXRlOiB7XG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgZXh0ZXJuYWw6IFsnYmV0dGVyLXNxbGl0ZTMnXSwgLy8gXHU1OTgyXHU2NzlDXHU0RjYwXHU1NzI4IHByZWxvYWQgXHU4RkRCXHU3QTBCXHU0RTJEXHU0RTVGXHU0RjdGXHU3NTI4XHU0RTg2IGJldHRlci1zcWxpdGUzXHVGRjBDXHU0RTVGXHU5NzAwXHU4OTgxXHU2REZCXHU1MkEwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVuZGVyZXI6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCdcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiB7fSxcbiAgICB9KSxcbiAgXSxcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVSxTQUFTLG9CQUFvQjtBQUM3VixPQUFPLFVBQVU7QUFDakIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sU0FBUztBQUhoQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsUUFDSixPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsVUFDSixPQUFPO0FBQUEsWUFDTCxlQUFlO0FBQUEsY0FDYixVQUFVLENBQUMsZ0JBQWdCO0FBQUE7QUFBQSxZQUM3QjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTyxLQUFLLEtBQUssa0NBQVcscUJBQXFCO0FBQUEsUUFDakQsTUFBTTtBQUFBLFVBQ0osT0FBTztBQUFBLFlBQ0wsZUFBZTtBQUFBLGNBQ2IsVUFBVSxDQUFDLGdCQUFnQjtBQUFBO0FBQUEsWUFDN0I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFVBQVUsUUFBUSxJQUFJLGFBQWEsU0FDL0IsU0FDQSxDQUFDO0FBQUEsSUFDUCxDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
