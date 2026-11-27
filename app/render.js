// Rendering for Bargain Beacon: the deal grid, the stats strip and the
// deal detail page. All markup is built from the deals data — nothing is
// fetched, and every store link is a plain <a href> out to the store.

import { deals } from "./deals.js";
import { discountPct, saveAmount, verdictOf, money, checkedLabel, storeInitials } from "./verdict.js";

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function dealCard(deal) {
  const v = verdictOf(deal);
  const pct = discountPct(deal);
  const saved = saveAmount(deal);
  return (
    '<article class="card verdict-' +
    deal.verdict +
    '">' +
    '<div class="card-top"><span class="store-chip" title="' +
    escapeHtml(deal.store) +
    '">' +
    storeInitials(deal.store) +
    " " +
    escapeHtml(deal.store) +
    '</span><span class="cat-chip">' +
    escapeHtml(deal.category) +
    "</span></div>" +
    '<h3 class="card-title"><a href="#/deal/' +
    deal.id +
    '">' +
    escapeHtml(deal.title) +
    "</a></h3>" +
    '<div class="price-row"><span class="price">' +
    money(deal.price) +
    '</span><span class="was">' +
    money(deal.was) +
    '</span><span class="pct">−' +
    pct +
    "%</span></div>" +
    '<p class="save-line">You save ' +
    money(saved) +
    "</p>" +
    '<p class="verdict-line"><span class="verdict-badge">' +
    v.label +
    "</span> " +
    escapeHtml(v.blurb) +
    "</p>" +
    '<p class="why">' +
    escapeHtml(deal.why) +
    "</p>" +
    '<div class="card-foot"><a class="store-link" href="' +
    escapeHtml(deal.url) +
    '" target="_blank" rel="noopener">View at ' +
    escapeHtml(deal.store) +
    " ↗</a>" +
    '<span class="checked">Checked ' +
    checkedLabel(deal.checked) +
    "</span></div>" +
    "</article>"
  );
}

export function statsStrip(list) {
  const stores = new Set(list.map((d) => d.store)).size;
  const cats = new Set(list.map((d) => d.category)).size;
  const best = list.reduce((m, d) => Math.max(m, discountPct(d)), 0);
  const totalSaved = list.reduce((s, d) => s + saveAmount(d), 0);
  const lows = list.filter((d) => d.verdict === "new-low").length;
  return (
    '<div class="stat"><strong>' +
    list.length +
    '</strong><span>deals checked</span></div>' +
    '<div class="stat"><strong>' +
    stores +
    '</strong><span>stores</span></div>' +
    '<div class="stat"><strong>' +
    cats +
    '</strong><span>categories</span></div>' +
    '<div class="stat"><strong>' +
    lows +
    '</strong><span>new lows</span></div>' +
    '<div class="stat"><strong>−' +
    best +
    '%</strong><span>deepest cut</span></div>' +
    '<div class="stat"><strong>' +
    money(totalSaved) +
    '</strong><span>total savings</span></div>'
  );
}

export function emptyState() {
  return (
    '<div class="empty"><h2>No deals match that search</h2>' +
    "<p>Try a different word, or clear a filter — every deal on this board is still here.</p>" +
    '<button id="clear-filters" type="button">Clear search &amp; filters</button></div>'
  );
}

// The deal detail page: full evidence for one deal, plus the same product
// at other stores when this board tracked it more than once.

export function dealDetail(deal) {
  const v = verdictOf(deal);
  const pct = discountPct(deal);
  const saved = saveAmount(deal);
  const siblings = deal.group
    ? deals.filter((d) => d.group === deal.group && d.id !== deal.id)
    : [];
  let compare = "";
  if (siblings.length) {
    const rows = siblings
      .map((s) => {
        const cheaper = s.price < deal.price;
        const dearer = s.price > deal.price;
        const tag = cheaper
          ? '<span class="cmp-tag cheaper">cheaper here</span>'
          : dearer
            ? '<span class="cmp-tag dearer">costs more here</span>'
            : '<span class="cmp-tag">same price</span>';
        return (
          '<li><a href="#/deal/' +
          s.id +
          '">' +
          escapeHtml(s.title) +
          "</a> — <strong>" +
          money(s.price) +
          "</strong> at " +
          escapeHtml(s.store) +
          " " +
          tag +
          "</li>"
        );
      })
      .join("");
    compare =
      '<section class="compare"><h2>Same product, other stores</h2><ul>' +
      rows +
      "</ul></section>";
  }
  return (
    '<article class="detail verdict-' +
    deal.verdict +
    '">' +
    '<p class="crumb"><a href="#/">← All deals</a></p>' +
    '<div class="card-top"><span class="store-chip">' +
    storeInitials(deal.store) +
    " " +
    escapeHtml(deal.store) +
    '</span><span class="cat-chip">' +
    escapeHtml(deal.category) +
    "</span></div>" +
    "<h2>" +
    escapeHtml(deal.title) +
    "</h2>" +
    '<div class="price-row big"><span class="price">' +
    money(deal.price) +
    '</span><span class="was">' +
    money(deal.was) +
    '</span><span class="pct">−' +
    pct +
    "%</span></div>" +
    "<p class=\"save-line\">You save " +
    money(saved) +
    " (" +
    pct +
    "% off list)</p>" +
    '<p class="verdict-line big"><span class="verdict-badge">' +
    v.label +
    "</span> " +
    escapeHtml(v.blurb) +
    "</p>" +
    "<h3>Why this is " +
    (deal.verdict === "routine" ? "only a routine sale" : "really a deal") +
    "</h3>" +
    "<p>" +
    escapeHtml(deal.why) +
    "</p>" +
    (deal.note ? "<p class=\"note\">Note: " + escapeHtml(deal.note) + "</p>" : "") +
    '<p class="store-cta"><a class="store-link big" href="' +
    escapeHtml(deal.url) +
    '" target="_blank" rel="noopener">View this product at ' +
    escapeHtml(deal.store) +
    " ↗</a></p>" +
    '<dl class="provenance"><dt>Price checked</dt><dd>' +
    checkedLabel(deal.checked) +
    "</dd><dt>Where the price was read</dt><dd>" +
    escapeHtml(deal.source) +
    "</dd><dt>Usual price</dt><dd>" +
    money(deal.was) +
    " (as stated by the source)</dd></dl>" +
    compare +
    "</article>"
  );
}

export function dealNotFound(id) {
  return (
    '<div class="empty"><h2>No deal called “' +
    escapeHtml(id) +
    '”</h2><p>It may have sold out or been taken off the board.</p>' +
    '<p><a href="#/">← Back to all deals</a></p></div>'
  );
}
