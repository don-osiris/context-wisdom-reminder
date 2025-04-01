
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1308907c2ed949139bf8a96dcfe92885',
  appName: 'context-wisdom-reminder',
  webDir: 'dist',
  server: {
    url: "https://1308907c-2ed9-4913-9bf8-a96dcfe92885.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: undefined,
    }
  }
};

export default config;
