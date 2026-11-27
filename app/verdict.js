// Verdicts and money maths for Bargain Beacon.
// The verdict is the board's honest call on whether a sale price is really
// a deal, judged on the evidence in each deal's `why` field.

export const VERDICTS = {
  "new-low": { rank: 0, label: "NEW LOW", blurb: "Lowest price ever tracked" },
  strong: { rank: 1, label: "STRONG DEAL", blurb: "A real cut, well under list" },
  good: { rank: 2, label: "GOOD PRICE", blurb: "Genuine saving — check the rival store" },
  refurb: { rank: 3, label: "REFURB STEAL", blurb: "Cheapest — but refurbished, not new" },
  routine: { rank: 4, label: "ROUTINE SALE", blurb: "A small cut — think twice" },
};

export function discountPct(deal) {
  if (!deal.was || deal.was <= deal.price) return 0;
  return Math.round(((deal.was - deal.price) / deal.was) * 100);
}

export function saveAmount(deal) {
  return Math.max(0, deal.was - deal.price);
}

export function verdictOf(deal) {
  return VERDICTS[deal.verdict] || VERDICTS.good;
}

export function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

export function checkedLabel(iso) {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pad = (x) => String(x).padStart(2, "0");
  return (
    d.getUTCDate() +
    " " +
    months[d.getUTCMonth()] +
    " " +
    d.getUTCFullYear() +
    ", " +
    pad(d.getUTCHours()) +
    ":" +
    pad(d.getUTCMinutes()) +
    " UTC"
  );
}

// Sort keys the toolbar offers. "best" puts true lows first, then the
// deepest discounts, so the strongest evidence rises to the top.
export const SORTS = {
  best: { label: "Best deals first", fn: (a, b) => verdictOf(a).rank - verdictOf(b).rank || discountPct(b) - discountPct(a) },
  discount: { label: "Biggest % off", fn: (a, b) => discountPct(b) - discountPct(a) },
  saving: { label: "Biggest $ saving", fn: (a, b) => saveAmount(b) - saveAmount(a) },
  priceAsc: { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  priceDesc: { label: "Price: high to low", fn: (a, b) => b.price - a.price },
};

export function storeInitials(store) {
  return store
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
