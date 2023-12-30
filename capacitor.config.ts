import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.gov.myjp.app',
  appName: 'MyJP',
  loggingBehavior: "none",
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false
    },
    SplashScreen: {
      "launchShowDuration": 10
    },
  }
};

export default config;
