# Bargain Beacon — Real Black Friday Deals, Checked by Hand

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun rank](https://make.fun/badge/black-friday-deal-finder-01/Fajargh/black-friday-deal-finder-01-001/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun reward](https://make.fun/badge/black-friday-deal-finder-01/Fajargh/black-friday-deal-finder-01-001/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A static deal-finder site for Black Friday and Cyber Monday 2026, built for the
[black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01) bounty on make.fun.

## What it is

**32 real deals at 8 stores** (Amazon, Best Buy, Walmart, Target, Costco, Kohl's,
eBay, Newegg) across 13 categories — audio, laptops, TVs, gaming, home, kitchen,
toys, phones, wearables, tablets, smart home, accessories and PC parts.

Every deal carries its product, store, sale price, usual price, discount, a link
to the product at that store, and when its price was checked. Every price was
read by the maker on **27 Nov 2026** from the store or the deals source named on
the deal — 9to5Mac, MacRumors, 9to5Toys, TechRadar, Best Buy's own Black Friday
release, Walmart.com, Topsave, DealNews, Slickdeals, GameGavel and Kohl's own
announcement. The "usual price" is the one the source itself stated, so every
discount on the board is arithmetic, not a guess.

## The honest verdict

Each deal carries a signal saying whether it is really a deal:

- **NEW LOW** — the lowest price ever tracked (5 deals, including AirPods Pro 3 at $149)
- **STRONG DEAL** — a real cut, well under list
- **GOOD PRICE** — genuine saving, but a rival store beats it (MacBook Air M5: $1,049 at Best Buy vs $989 at Amazon)
- **ROUTINE SALE** — a small cut, think twice (Ninja SLUSHi XL at Kohl's: only 14% off)
- **REFURB STEAL** — cheapest, but refurbished, not new

Where the board tracked one product at two stores, the deal page compares them
side by side.

## How it works

- Search that actually searches (product, store, category), plus filters by
  category, store and minimum discount, and sorting by best deal, biggest % off,
  biggest $ saving, or price.
- A stats strip: deal count, stores, categories, new lows, deepest cut, total savings.
- A detail page per deal (`#/deal/<id>`) with the full evidence: why the verdict,
  any condition or coupon code, the check time, and where the price was read.
- Fully static: `app/` has no build step and makes no network requests. Open
  `app/index.html` from any static server. Works on desktop and on a phone.

## Run it locally

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to
the output directory and writes `dossier.json` with the vendored make.fun library.

## License

MIT — see [LICENSE](LICENSE).

---
Built for [make.fun](https://make.fun/bounty/black-friday-deal-finder-01?ref=8cvj6bwy) · black-friday-deal-finder-01
