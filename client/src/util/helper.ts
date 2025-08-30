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
  "bg-rose-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-lime-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-green-500",
];

export const getColor = (index: number): string => {
  return COLORS[index % COLORS.length];
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
