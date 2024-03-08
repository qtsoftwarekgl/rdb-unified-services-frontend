import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const importLanguageConfings = function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return import.meta.glob("./locales/**/*.json", { eager: true });
};

export const getI18nConfigs = (modules: { [module: string]: any }) => {
  if (!Object.keys(modules).length) return {};
  return Object.entries(modules).reduce(
    (acc: { [key: string]: any }, [filePath, json]) => {
      // Extract language from file path
      const lang = filePath.split("/")[2];
      acc[lang] = acc[lang] || {};
      acc[lang] = { ...acc[lang], ...json };
      return acc;
    },
    {}
  );
};

i18n.use(initReactI18next).init({
  resources: getI18nConfigs(importLanguageConfings()),
  lng: "en",
});
