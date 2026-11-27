// Bargain Beacon entrypoint: search, filters, sorting and hash routing.
// No network calls anywhere — the board renders from deals.js alone.

import { deals, CHECKED_AT } from "./deals.js";
import { SORTS, discountPct, verdictOf, checkedLabel } from "./verdict.js";
import { dealCard, dealDetail, dealNotFound, statsStrip, emptyState } from "./render.js";

const grid = document.getElementById("deal-grid");
const countLine = document.getElementById("count-line");
const statsEl = document.getElementById("stats");
const searchInput = document.getElementById("search");
const categorySel = document.getElementById("category");
const storeSel = document.getElementById("store");
const discountSel = document.getElementById("discount");
const sortSel = document.getElementById("sort");
const detailEl = document.getElementById("detail");
const listEl = document.getElementById("list-view");

function optionList(values, allLabel) {
  return (
    '<option value="">' +
    allLabel +
    "</option>" +
    values.map((v) => '<option value="' + v + '">' + v + "</option>").join("")
  );
}

function fillFilters() {
  const cats = [...new Set(deals.map((d) => d.category))].sort();
  const stores = [...new Set(deals.map((d) => d.store))].sort();
  categorySel.innerHTML = optionList(cats, "All categories");
  storeSel.innerHTML = optionList(stores, "All stores");
  discountSel.innerHTML =
    '<option value="">Any discount</option>' +
    '<option value="50">50% off or more</option>' +
    '<option value="40">40% off or more</option>' +
    '<option value="30">30% off or more</option>' +
    '<option value="20">20% off or more</option>' +
    '<option value="10">10% off or more</option>';
  sortSel.innerHTML = Object.entries(SORTS)
    .map(([k, s]) => '<option value="' + k + '">' + s.label + "</option>")
    .join("");
}

function currentFilters() {
  return {
    q: searchInput.value.trim().toLowerCase(),
    category: categorySel.value,
    store: storeSel.value,
    minDiscount: Number(discountSel.value || 0),
    sort: sortSel.value || "best",
  };
}

function applyFilters(list, f) {
  let out = list.filter((d) => {
    if (f.category && d.category !== f.category) return false;
    if (f.store && d.store !== f.store) return false;
    if (f.minDiscount && discountPct(d) < f.minDiscount) return false;
    if (f.q) {
      const hay = (d.title + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(f.q)) return false;
    }
    return true;
  });
  out = [...out].sort(SORTS[f.sort].fn);
  return out;
}

function renderList() {
  const f = currentFilters();
  const shown = applyFilters(deals, f);
  statsEl.innerHTML = statsStrip(deals);
  if (!shown.length) {
    grid.innerHTML = "";
    countLine.textContent = "0 of " + deals.length + " deals match";
    const holder = document.getElementById("empty-holder");
    holder.innerHTML = emptyState();
    const clear = document.getElementById("clear-filters");
    if (clear) clear.addEventListener("click", resetFilters);
    return;
  }
  document.getElementById("empty-holder").innerHTML = "";
  grid.innerHTML = shown.map(dealCard).join("");
  countLine.textContent =
    "Showing " + shown.length + " of " + deals.length + " deals · sorted: " + SORTS[f.sort].label;
}

function resetFilters() {
  searchInput.value = "";
  categorySel.value = "";
  storeSel.value = "";
  discountSel.value = "";
  sortSel.value = "best";
  renderList();
}

function route() {
  const hash = location.hash || "#/";
  const m = hash.match(/^#\/deal\/([\w-]+)$/);
  if (m) {
    const deal = deals.find((d) => d.id === m[1]);
    listEl.hidden = true;
    detailEl.hidden = false;
    detailEl.innerHTML = deal ? dealDetail(deal) : dealNotFound(m[1]);
    window.scrollTo(0, 0);
  } else {
    detailEl.hidden = true;
    listEl.hidden = false;
    detailEl.innerHTML = "";
    renderList();
  }
}

function applyUrlParams() {
  // Shareable filtered views: ?q=vacuum&category=Home&store=Walmart
  // &discount=50&sort=discount prefills the toolbar on load.
  const p = new URLSearchParams(location.search);
  if (p.get("q")) searchInput.value = p.get("q");
  if (p.get("category")) categorySel.value = p.get("category");
  if (p.get("store")) storeSel.value = p.get("store");
  if (p.get("discount")) discountSel.value = p.get("discount");
  if (p.get("sort") && SORTS[p.get("sort")]) sortSel.value = p.get("sort");
}

document.getElementById("checked-line").textContent =
  "All " + deals.length + " prices checked " + checkedLabel(CHECKED_AT) + " — read at the store or in the source named on each deal.";

fillFilters();
applyUrlParams();
for (const el of [searchInput, categorySel, storeSel, discountSel, sortSel]) {
  el.addEventListener("input", () => {
    if (!detailEl.hidden) location.hash = "#/";
    renderList();
  });
}
window.addEventListener("hashchange", route);
route();
