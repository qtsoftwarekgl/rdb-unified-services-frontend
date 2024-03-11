import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const importLanguageConfings = async function () {
  const modules = await import.meta.glob("./locales/**/*.json", {
    eager: true,
  });
  return modules;
};

const globalResources: { [key: string]: any } = {};

const getI18nConfigs = async () => {
  const modules = await importLanguageConfings();
  if (!Object.keys(modules).length) return globalResources;

  for (const [filePath, json] of Object.entries(modules)) {
    // Extract language from file path
    const lang = filePath.split("/")[2];
    globalResources[lang] = globalResources[lang] || {};
    globalResources[lang]["translation"] =
      globalResources[lang]["translation"] || {};
    Object.assign(globalResources[lang]["translation"], json["translation"]);
  }

  return globalResources;
};

async function initializeI18n() {
  const resources = await getI18nConfigs();
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
  });
}

initializeI18n();
