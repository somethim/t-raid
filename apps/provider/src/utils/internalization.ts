import type { Language } from "../schemas/enums";

const en = {} as const;

const al = {} as const;

type Dictionary<L extends Language> = L extends "en" ? typeof en : typeof al;
type DictionaryKey<L extends Language> = L extends "en"
  ? keyof typeof en
  : keyof typeof al;

type GetDynamicTranslation<T extends string> =
  T extends `${infer Before}{{${infer Key}}}${infer After}`
    ? Key | GetDynamicTranslation<After>
    : never;

type DictionaryEntryArguments<
  L extends Language,
  T extends DictionaryKey<L>,
> = Record<GetDynamicTranslation<Dictionary<L>[T]>, string | number>;

export const translate = <L extends Language, T extends DictionaryKey<L>>(
  locale: L,
  key: T,
  args: DictionaryEntryArguments<L, T> = {} as DictionaryEntryArguments<L, T>,
) => {
  const translations = locale === "en" ? en : al;
  let translation: string = translations[key];

  if (!translation) {
    return key;
  }

  for (const [key, value] of Object.entries(args)) {
    translation = translation.replace(`{{${key}}}`, value?.toString() ?? "");
  }

  return translation;
};
