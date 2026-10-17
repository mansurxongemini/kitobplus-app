import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uz.kitobplus.app',
  appName: 'KitobPlus',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
};

export default config;
