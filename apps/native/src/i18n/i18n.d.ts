import type translationEn from "@/assets/translations/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      [K in "" | "translation"]: typeof translationEn;
    };
  }
}
