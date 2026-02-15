import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as path from 'path';
import scanFiles from './packageGenerator/scan-files.js';

enum ETypes {
  TS = 'ts',
}

type TFileNode = {
  path: string;
  name: string;
  ext: ETypes;
};

type TFileTree = {
  [key: string]: TFileNode[];
};

const index: TFileTree = scanFiles('src', ['.d.ts'], ['prompts', 'tests', 'types']);
const models: TFileTree = scanFiles('src/models', ['.test.ts'], ['prompts', 'tests', 'types']);

const dynamicFileNames = Object.fromEntries(
  Object.entries({ ...index, ...models }).flatMap(([dirPath, files]) => {
    return files.map((file) => {
      const fileName = path.parse(file.name).name;

      return [
        fileName,
        {
          path: file.path.includes('src/') ? file.path.replace('src/', '') : file.path,
          name: fileName,
        },
      ];
    });
  }),
);

export const fileNames = {
  ...dynamicFileNames,
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      viteStaticCopy({
        targets: [{ src: 'src/types.d.ts', dest: './' }],
      }),
    ],
    server: {
      port: 3000,
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },
    build: {
      cssCodeSplit: false,
      lib: {
        entry: Object.entries(fileNames).map(([_, value]) => {
          return value.path.includes('src')
            ? `./${value.path}/${value.name}`
            : `./src/${value.path}/${value.name}`;
        }),
        formats: ['es'],
        fileName: (format, entryName) => {
          return fileNames[entryName as keyof typeof fileNames].path.includes('src')
            ? `${fileNames[entryName as keyof typeof fileNames].name}.esm.js`
            : `${fileNames[entryName as keyof typeof fileNames].path}/${
                fileNames[entryName as keyof typeof fileNames].name
              }.esm.js`;
        },
      },
      rollupOptions: {
        external: ['vue', 'fs'],
        output: {
          chunkFileNames: '_common/[name]-[hash].js',
          globals: {
            vue: 'Vue',
          },
          exports: 'named' /** Disable warning for default imports */,
        },
      },
      chunkSizeWarningLimit: 50,
      sourcemap: mode === 'development',
    },
  };
});
