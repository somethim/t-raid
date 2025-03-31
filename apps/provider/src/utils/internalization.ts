import type { Language } from "../schemas/enums";

const en = {
  "booking/starting": "Booking starts in {{minutes}} minutes",
  "booking/ending": "Booking ends in {{minutes}} minutes",
  "booking/expired":
    "Booking has ended {{minutes}} ago, please move your vehicle to avoid overstay fees",
  "booking/new": "You have a new booking at {{datetime}}",
  "booking/finished":
    "Your booking has ended, you have 5 minutes to close the booking and move your vehicle to avoid overstay fees",
  "payment/failed": "Payment failed",
  "refund/succeeded": "Your booking has ben successfully refunded",
  "refund/failed": "Failed to refund your booking, please contact your bank",
} as const;

const al = {
  "booking/starting": "Parkimi fillon për {{minutes}} minuta",
  "booking/ending": "Parkimi përfundon për {{minutes}} minuta",
  "booking/finished":
    "Parkimi juaj ka përfunduar, keni 5 minuta kohë për të mbyllur seancën dhe lëvizur mjetin që të shmangni tarifat e shtuara nga qëndrimi i tepërt",
  "booking/expired":
    "Parkimi ka përfunduar {{minutes}} minuta më parë, duhet të zhvendosni mjetin tuaj që të shmangni tarifat e shtuara nga qëndrimi i tepërt",
  "booking/new": "Ju keni një parkim të ri në {{datetime}}",
  "payment/failed": "Pagesa dështoi",
  "refund/succeeded": "Parkimi juaj është rimbursuar me sukses",
  "refund/failed":
    "Dështoi rimbursimi i parkimit tuaj, ju lutem kontaktoni bankën tuaj",
} as const;

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
