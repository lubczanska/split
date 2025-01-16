export const CURRENCIES = [
  { value: "PLN", label: "Polish Zloty" },
  { value: "EUR", label: "Euro" },
  { value: "USD", label: "US Dollar" },
  { value: "GBP", label: "British Pound" },
  { value: "CZK", label: "Czech Koruna" },
];

export const EMOJI = [
  { value: "🙂", label: "🙂" },
  { value: "💵", label: "💵" },
  { value: "💩", label: "💩" },
  { value: "💀", label: "💀" },
  { value: "🏙️", label: "🏙️" },
  { value: "🏕️", label: "🏕️" },
  { value: "🏝️", label: "🏝️" },
  { value: "🏔️", label: "🏔️" },
  { value: "🌍", label: "🌍" },
  { value: "🏠", label: "🏠" },
  { value: "🌞", label: "🌞" },
  { value: "🔥", label: "🔥" },
  { value: "⚽", label: "⚽" },
  { value: "🧗", label: "🧗" },
  { value: "🐸", label: "🐸" },
  { value: "🙃", label: "🙃" },
];

export const CATEGORIES = [
  { value: "Others", label: "💵 Other" },
  { value: "Transport", label: "🚗 Transport" },
  { value: "Food", label: "🍕 Food" },
  { value: "Shopping", label: "🛍️ Shopping" },
  { value: "Entertainment", label: "🛍️ Entertainment" },
  { value: "Home", label: "🛍️ Home" },
  { value: "Accomodation", label: "🛏️ Accomodation" },
];

export const CATEGORY_LABELS = {
  Others: "💵",
  Transfer: "💸",
  Transport: "🚗",
  Food: "🍕",
  Shopping: "🛍️",
  Entertainment: "🛍️",
  Home: "🛍️",
  Accomodation: "🛏️",
};

export function categoryEmoji(category: string) {
  const emojis: Record<string, string> = CATEGORY_LABELS
  return emojis[category];
}