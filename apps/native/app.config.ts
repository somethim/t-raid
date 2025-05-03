import type { ConfigContext, ExpoConfig } from "expo/config";

const getUniqueIdentifier = () => {
  return "com.company.traid";
};

const getAppName = () => {
  return "T-Raid";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "t-raid",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "traid",
  userInterfaceStyle: "automatic",
  owner: "company",
  newArchEnabled: true,
  ios: {
    usesAppleSignIn: true,
    bundleIdentifier: getUniqueIdentifier(),
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Allow $(PRODUCT_NAME) to use your location for map navigation and parking lots localization",
      ITSAppUsesNonExemptEncryption: false,
    },
    icon: {
      light: "./assets/images/logos/cat.jpg",
      dark: "./assets/images/logos/cat.jpg",
      tinted: "./assets/images/logos/cat.jpg",
    },
  },
  android: {
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      foregroundImage: "./assets/images/logos/cat.jpg",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logos/cat.jpg",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    // [
    //   "expo-font",
    //   {
    //     fonts: [
    //       "./assets/fonts/rf-dewi/normal/RFDewi-Regular.ttf",
    //       "./assets/fonts/rf-dewi/normal/RFDewi-Semibold.ttf",
    //       "./assets/fonts/rf-dewi/normal/RFDewi-Bold.otf",
    //       "./assets/fonts/rf-dewi/normal/RFDewi-Black.otf",
    //       "./assets/fonts/rf-dewi/extended/RFDewiExtended-Regular.otf",
    //       "./assets/fonts/rf-dewi/extended/RFDewiExtended-Semibold.ttf",
    //       "./assets/fonts/rf-dewi/extended/RFDewiExtended-Bold.otf",
    //     ],
    //   },
    // ],
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logos/cat.jpg",
        backgroundColor: "#ECEDEE",
        dark: {
          image: "./assets/images/logos/cat.jpg",
          backgroundColor: "#151718",
        },
        imageWidth: 200,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
