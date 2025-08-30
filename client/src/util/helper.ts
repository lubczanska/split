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

export const CATEGORY_LABELS = {
  Others: "💵",
  Transfer: "💸",
  Transport: "🚗",
  Food: "🍕",
  Shopping: "🛍️",
  Entertainment: "🎲",
  Home: "🏠",
  Accomodation: "🛏️",
};

export const CATEGORIES = [
  { value: "Others", label: "💵 Other" },
  { value: "Transport", label: "🚗 Transport" },
  { value: "Food", label: "🍕 Food" },
  { value: "Shopping", label: "🛍️ Shopping" },
  { value: "Entertainment", label: "🎲 Entertainment" },
  { value: "Home", label: "🏠 Home" },
  { value: "Accomodation", label: "🛏️ Accomodation" },
];

export function categoryEmoji(category: string) {
  const emojis: Record<string, string> = CATEGORY_LABELS;
  return emojis[category];
}

const COLORS = [
  "#f43f5e",
  "#3b82f6",
  "#eab308",
  "#a855f7",
  "fuchsia",
  "#84cc16",
  "#14b8a6",
  "#f97316",
  "#22c55e",
];

export const COLORS_TAILWIND = [
  "rose",
  "blue",
  "yellow",
  "purple",
  "fuchsia",
  "lime",
  "teal",
  "orange",
  "green",
];

export const getColor = (index: number, length: number): string => {
  if (index < COLORS.length) return COLORS[index];
  if (index == length - 1) return "#ffffff";
  else return COLORS[index % COLORS.length];
};

export const getTailwindColor = (index: number, length: number): string => {
  if (index < COLORS_TAILWIND.length) return COLORS_TAILWIND[index];
  if (index == length - 1) return "white";
  else return COLORS_TAILWIND[index % COLORS_TAILWIND.length];
};
// export const parseAmount = (expr: string) : number => {
//   // parse expr and return result
//   // throw error if expr is invalid
//   throw "todo"
// }

// export const currencyChange = (amount: number, sourceCurrency: string, targetCurrency) : number => {
//   // get exchange rate from api call
//   // return amount in target currency
//   throw "todo"

// }
