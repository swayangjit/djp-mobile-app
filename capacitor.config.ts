import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'khel-khel-me',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false
    },
    SplashScreen: {
      "launchShowDuration": 100
    },
  }
};

export default config;
