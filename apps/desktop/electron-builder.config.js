import { defineConfig } from 'electron-builder';

export default defineConfig({
  appId: 'com.bao-thuc.app',
  productName: 'Báo thức',
  directories: {
    output: 'dist-electron',
  },
  files: [
    'dist/**/*',
    'electron/**/*',
    'package.json',
  ],
  win: {
    target: ['nsis'],
    icon: 'build/icon.ico',
  },
  mac: {
    target: ['dmg'],
    icon: 'build/icon.icns',
    category: 'public.app-category.healthcare-fitness',
  },
  linux: {
    target: ['AppImage'],
    icon: 'build/icon.png',
    category: 'Utility',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
});

