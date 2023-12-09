import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.ekstep.djp',
  appName: 'Jadui Pitara',
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
