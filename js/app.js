// ===== otdoner · мәзір, корзина, тапсырыс =====

const CFG = window.OTDONER_CONFIG;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  cat: CATEGORIES[0].id,
  variant: {},            // chicken → "9" сияқты таңдалған мөлшер
  flavor: {},             // fuse → "peach" сияқты таңдалған дәм
  cart: readCart(),       // { "doner-beef": 2, "chicken:9": 1, "fuse:1:peach": 1 }
  view: "cart",           // cart | form | done
  order: { type: "pickup", pay: "kaspi" },
  lastWaUrl: "",
};

// ---------- Корзина деректері ----------
// Кілт: "id", "id:мөлшер" немесе "id:мөлшер:дәм"
function findItem(key) {
  const [id, variantId, flavorId] = key.split(":");
  const item = MENU.find((m) => m.id === id);
  if (!item) return null;
  const v = item.variants ? item.variants.find((x) => x.id === variantId) : null;
  const f = item.flavors ? item.flavors.find((x) => x.id === flavorId) : null;
  if ((item.variants && !v) || (item.flavors && !f)) return null;
  const name = [tr(item.name), f && tr(f), v && tr(v)].filter(Boolean).join(" ");
  return { item, key, price: v ? v.price : item.price, name, img: (f && f.img) || item.img };
}

function cartLines() {
  return Object.entries(state.cart)
    .map(([key, qty]) => ({ ...findItem(key), qty }))
    .filter((l) => l.item && l.qty > 0);
}

function cartTotal() {
  return cartLines().reduce((sum, l) => sum + l.price * l.qty, 0);
}

function saveCart() {
  // мәзірден өшірілген тағамдарды тазалаймыз
  for (const key of Object.keys(state.cart)) {
    if (!findItem(key) || state.cart[key] <= 0) delete state.cart[key];
  }
  try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) {}
  renderFab();
  checkFree();
  updateCartBadge(state.cart);
}

function setQty(key, qty) {
  if (qty > 0 && StopList.hasKey(key)) return;
  if (qty <= 0) delete state.cart[key];
  else state.cart[key] = Math.min(qty, 99);
  saveCart();
  renderMenu();
  if ($("#sheet").classList.contains("is-open")) renderSheet();
}

function keyFor(item, over = {}) {
  const parts = [item.id];
  if (item.variants) parts.push(over.v || state.variant[item.id] || item.variants[0].id);
  if (item.flavors) {
    if (!item.variants) parts.push("");
    parts.push(over.f || state.flavor[item.id] || item.flavors[0].id);
  }
  return parts.join(":");
}

// Таңдалған көлем/дәм стопта болса — бар нұсқаға ауысамыз (алдымен дәмін, сосын көлемін сақтап)
function pickKey(item) {
  const key = keyFor(item);
  if (!StopList.hasKey(key)) return key;
  const [, v0, f0] = key.split(":");
  const vs = item.variants ? item.variants.map((v) => v.id) : [undefined];
  const fs = item.flavors ? item.flavors.map((f) => f.id) : [undefined];
  const tries = [
    ...vs.map((v) => keyFor(item, { v, f: f0 })),
    ...fs.map((f) => keyFor(item, { v: v0, f })),
    ...vs.flatMap((v) => fs.map((f) => keyFor(item, { v, f }))),
  ];
  return tries.find((k) => !StopList.hasKey(k)) || key;
}

// Дәмнің барлық көлемі стопта ма
function flavorOut(item, f) {
  return (item.variants || [{}]).every((v) => StopList.hasKey(keyFor(item, { v: v.id, f })));
}

// ---------- Комбо / сет құрамы ----------
function setLine([ref, qty, note]) {
  if (ref === "chicken-pcs") return t("set.chickenPcs").replace("{n}", qty);
  if (SET_EXTRAS[ref]) return `${qty} ${tr(SET_EXTRAS[ref])}`;
  const it = findItem(ref);
  let name = it ? it.name : ref;
  // «Пепперони» → «Пицца «Пепперони»», сет ішінде түсінікті болу үшін
  if (it && it.item.cat === "pizza" && !/пицц|pizza/i.test(name)) name = `${t("set.pizza")} «${name}»`;
  return `${qty > 1 ? `${qty}× ` : ""}${name}${note ? ` (${note})` : ""}`;
}

// Комбоның құрамын жеке алғандағы бағасы (сызылған баға)
function setFullPrice(item) {
  return (item.set || []).reduce((sum, [ref, qty]) => {
    const it = SET_EXTRAS[ref] || ref === "chicken-pcs" ? null : findItem(ref);
    return sum + (it ? it.price * qty : 0);
  }, 0);
}

function setHtml(item) {
  if (!item.set) return "";
  const gifts = item.gifts ? `<p class="set__gifts"><b>${t("set.gift")}:</b> ${item.gifts.map((g) => escapeHtml(setLine(g))).join(", ")}</p>` : "";
  return `<ul class="set">${item.set.map((l) => `<li>${escapeHtml(setLine(l))}</li>`).join("")}</ul>${gifts}`;
}

// ---------- Мәзір ----------
function renderTabs() {
  const tabs = $("#tabs");
  tabs.innerHTML = CATEGORIES.map((c) => `
    <button class="tab" role="tab" id="tab-${c.id}" aria-controls="menu-grid"
      aria-selected="${c.id === state.cat}" tabindex="${c.id === state.cat ? 0 : -1}" data-cat="${c.id}">${escapeHtml(tr(c))}</button>
  `).join("");
}

function stepperHtml(key, qty, sm = false) {
  return `<div class="stepper${sm ? " stepper--sm" : ""}">
    <button type="button" data-dec="${key}" aria-label="${t("menu.less")}">${icon("minus")}</button>
    <output aria-live="polite">${qty}</output>
    <button type="button" data-inc="${key}" aria-label="${t("menu.more")}">${icon("plus")}</button>
  </div>`;
}

function mediaHtml(item, img = item.img, label = tr(item.name)) {
  if (!img) {
    return `<div class="card__media card__media--empty">${placeholderSvg()}</div>`;
  }
  const alt = escapeHtml(label);
  return `<div class="card__media${item.photo ? " card__media--photo" : ""}">
    <img src="img/menu/${img}.webp"
      srcset="img/menu/${img}-s.webp 520w, img/menu/${img}.webp ${item.photo ? 720 : 960}w"
      sizes="(min-width: 960px) 380px, (min-width: 560px) 48vw, 92vw"
      width="960" height="720" alt="${alt}" loading="lazy" decoding="async">
  </div>`;
}

function renderMenu() {
  const grid = $("#menu-grid");
  const items = MENU.filter((m) => m.cat === state.cat);
  grid.setAttribute("aria-labelledby", `tab-${state.cat}`);
  grid.classList.toggle("grid--solo", items.length === 1);
  grid.innerHTML = items.map((item) => {
    const key = pickKey(item);
    const [, curV, curF] = key.split(":");
    const qty = state.cart[key] || 0;
    const sel = findItem(key);
    const flavors = item.flavors ? `
      <div class="flavors" role="group" aria-label="${t("menu.flavor")}">
        ${item.flavors.map((f) => `
          <button type="button" class="flavors__btn" data-flavor="${item.id}:${f.id}"
            aria-pressed="${f.id === curF}" ${flavorOut(item, f.id) ? "disabled" : ""}>${escapeHtml(tr(f))}</button>
        `).join("")}
      </div>` : "";
    const sizes = item.variants ? `
      <div class="sizes" role="group" aria-label="${t("menu.size")}" style="grid-template-columns:repeat(${item.variants.length},1fr)">
        ${item.variants.map((v) => {
          const out = StopList.hasKey(keyFor(item, { v: v.id, f: curF }));
          return `<button type="button" class="sizes__btn" data-variant="${item.id}:${v.id}"
            aria-pressed="${v.id === curV}" ${out ? "disabled" : ""}>${escapeHtml(tr(v))}<small>${out ? t("menu.stopped") : formatPrice(v.price)}</small></button>`;
        }).join("")}
      </div>` : "";
    // бүкіл тағам немесе оның барлық нұсқасы стопта
    const stopped = StopList.hasKey(key);
    const action = stopped
      ? `<span class="stop-tag">${t("menu.stopped")}</span>`
      : qty > 0
        ? stepperHtml(key, qty)
        : `<button type="button" class="add" data-add="${key}" aria-label="${t("menu.addAria")}: ${escapeHtml(sel.name)}">${icon("plus")}<span>${t("menu.add")}</span></button>`;
    return `<article class="card${stopped ? " card--stopped" : ""}" data-item="${item.id}">
      ${mediaHtml(item, sel.img, sel.name)}
      ${stopped ? `<span class="card__stop">${t("menu.stopped")}</span>` : item.isNew ? `<span class="card__new">${t("menu.new")}</span>` : ""}
      <div class="card__body">
        <h3 class="card__name">${escapeHtml(tr(item.name))}</h3>
        ${item.people ? `<span class="card__people">${icon("people")}${t("set.people").replace("{n}", item.people)}</span>` : ""}
        ${item.desc ? `<p class="card__desc">${escapeHtml(tr(item.desc))}</p>` : ""}
        ${setHtml(item)}
        ${flavors}
        ${sizes}
        <div class="card__foot">
          <span class="card__price">${item.showOld && setFullPrice(item) > sel.price ? `<s class="card__old">${formatPrice(setFullPrice(item))}</s>` : ""}${formatPrice(sel.price)}</span>
          ${action}
        </div>
      </div>
    </article>`;
  }).join("");
}

function selectCat(id, focus = false) {
  state.cat = id;
  renderTabs();
  renderMenu();
  const tabs = $("#tabs");
  const tab = $(`#tab-${id}`);
  if (!tab) return;
  // табты көлденең ортаға әкелеміз (sticky ішінде scrollIntoView бетті секіртеді)
  const shift = tab.getBoundingClientRect().left - tabs.getBoundingClientRect().left;
  tabs.scrollTo({ left: tabs.scrollLeft + shift - (tabs.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  if (focus) tab.focus({ preventScroll: true });
  // мәзірдің ортасында тұрса — жаңа категорияның басына көтерілеміз
  const bar = $(".tabs-bar").getBoundingClientRect();
  const gridTop = $("#menu-grid").getBoundingClientRect().top;
  if (gridTop < bar.bottom) {
    window.scrollTo({ top: window.scrollY + gridTop - bar.bottom - 12, behavior: "smooth" });
  }
}

function bindMenu() {
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (b) selectCat(b.dataset.cat);
  });
  $("#tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = CATEGORIES.findIndex((c) => c.id === state.cat);
    const next = CATEGORIES[(i + (e.key === "ArrowRight" ? 1 : -1) + CATEGORIES.length) % CATEGORIES.length];
    selectCat(next.id, true);
  });

  $("#menu-grid").addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const variant = e.target.closest("[data-variant]");
    const flavor = e.target.closest("[data-flavor]");
    if (variant || flavor) {
      const [id, val] = (variant ? variant.dataset.variant : flavor.dataset.flavor).split(":");
      (variant ? state.variant : state.flavor)[id] = val;
      renderMenu();
      const again = $(`[data-${variant ? "variant" : "flavor"}="${id}:${val}"]`);
      if (again && e.detail === 0) again.focus();
      return;
    }
    const key = (add || inc || dec)?.dataset[add ? "add" : inc ? "inc" : "dec"];
    if (!key) return;
    setQty(key, (state.cart[key] || 0) + (dec ? -1 : 1));
    if (add || inc) bumpFab();
    // фокусты қайта жасалған батырмаға қайтарамыз
    const card = $(`[data-item="${key.split(":")[0]}"]`);
    const again = card && $(dec && !state.cart[key] ? "[data-add]" : "[data-inc]", card);
    if (again && e.detail === 0) again.focus();
  });
}

// ---------- Қалқымалы батырма ----------
function renderFab() {
  const lines = cartLines();
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const fab = $("#fab");
  fab.hidden = count === 0;
  document.body.classList.toggle("has-fab", count > 0);
  $("#fab-count").textContent = count;
  $("#fab-total").textContent = formatPrice(cartTotal());
}

function bumpFab() {
  const fab = $("#fab-count");
  fab.classList.remove("pop");
  void fab.offsetWidth;
  fab.classList.add("pop");
}

// ---------- Шторка ----------
let lastFocus = null;

function openSheet(view = "cart") {
  lastFocus = document.activeElement;
  state.view = view;
  $("#sheet").classList.add("is-open");
  document.body.style.overflow = "hidden";
  renderSheet();
  setTimeout(() => $("#sheet .sheet__panel").focus(), 30);
}

function closeSheet() {
  $("#sheet").classList.remove("is-open");
  document.body.style.overflow = "";
  if (state.view === "done") state.view = "cart";
  if (lastFocus) lastFocus.focus();
}

// ---------- Жеткізу бағасы ----------
function zoneById(id) {
  return DELIVERY_ZONES.find((z) => z.id === id) || null;
}

function freeLeft() {
  return Math.max(0, FREE_DELIVERY_FROM - cartTotal());
}

// Жеткізу: тегін / белгілі баға / менеджер нақтылайды / аудан таңдалмаған
function deliveryInfo() {
  const o = state.order;
  if (o.type !== "delivery") return { fee: 0, known: true, pickup: true };
  if (cartTotal() >= FREE_DELIVERY_FROM) return { fee: 0, known: true, free: true };
  const z = zoneById(o.zone);
  if (!z) return { fee: 0, known: false, choose: true };
  if (z.price == null) return { fee: 0, known: false, zone: z };
  return { fee: z.price, known: true, zone: z };
}

function deliveryText(d) {
  if (d.free) return t("cart.deliveryFree");
  if (d.known) return formatPrice(d.fee);
  if (d.choose) return t("cart.deliveryChoose");
  return d.zone && d.zone.range ? `${d.zone.range} ₸, ${t("cart.deliveryTbd")}` : t("cart.deliveryTbd");
}

function zoneLabel(z) {
  const price = z.price != null ? formatPrice(z.price) : z.range ? `${z.range} ₸` : t("order.zoneTbd");
  return `${tr(z)} — ${price}`;
}

// ---------- Тегін жеткізу шкаласы ----------
function freeBarHtml() {
  const left = freeLeft();
  const pct = Math.min(100, Math.round((cartTotal() / FREE_DELIVERY_FROM) * 100));
  const text = left
    ? `${icon("scooter")}<span>${t("free.left").replace("{x}", `<b>${formatPrice(left)}</b>`)}</span>`
    : `${icon("check")}<span><b>${t("free.done")}</b></span>`;
  return `<div class="freebar${left ? "" : " is-done"}">
    <div class="freebar__text">${text}</div>
    <div class="freebar__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
    <p class="freebar__note">${t("free.note")}</p>
  </div>`;
}

// ---------- Қосымша сату: корзинада «қоса алыңыз» ----------
const UPSELL_IDS = ["cola", "fries", "nuggets", "ayran", "wedges", "sprite", "fanta", "fuse"];

function upsellHtml() {
  const inCart = new Set(Object.keys(state.cart).map((k) => k.split(":")[0]));
  const items = UPSELL_IDS
    .map((id) => MENU.find((m) => m.id === id))
    .filter((m) => m && !inCart.has(m.id))
    .map((m) => findItem(pickKey(m)))
    .filter((sel) => !StopList.hasKey(sel.key))
    .slice(0, 4);
  if (!items.length) return "";
  const left = freeLeft();
  const title = left ? t("upsell.titleFree").replace("{x}", formatPrice(left)) : t("upsell.title");
  return `<div class="upsell">
    <p class="upsell__title">${title}</p>
    <div class="upsell__row">
      ${items.map((sel) => {
        return `<button type="button" class="upsell__item" data-upsell="${sel.key}" aria-label="${t("menu.addAria")}: ${escapeHtml(sel.name)}">
          <span class="upsell__img">${sel.img ? `<img src="img/menu/${sel.img}-s.webp" alt="" loading="lazy">` : ""}</span>
          <span class="upsell__name">${escapeHtml(sel.name)}</span>
          <span class="upsell__price">${icon("plus")}${formatPrice(sel.price)}</span>
        </button>`;
      }).join("")}
    </div>
  </div>`;
}

// ---------- Шторка төменгі бөлігі: сомалар ----------
function totalsHtml() {
  const sub = cartTotal();
  const o = state.order;
  if (state.view !== "form") {
    return `<div class="total"><span>${t("cart.subtotal")}</span><strong>${formatPrice(sub)}</strong></div>`;
  }
  if (o.type !== "delivery") {
    return `<div class="total"><span>${t("cart.total")}</span><strong>${formatPrice(sub)}</strong></div>`;
  }
  const d = deliveryInfo();
  return `<div class="sum">
      <div class="sum__row"><span>${t("cart.subtotal")}</span><span>${formatPrice(sub)}</span></div>
      <div class="sum__row"><span>${t("cart.delivery")}</span><span class="${d.free ? "is-free" : ""}">${deliveryText(d)}</span></div>
    </div>
    <div class="total"><span>${t("cart.total")}</span><strong>${formatPrice(sub + d.fee)}${d.known ? "" : " +"}</strong></div>`;
}

function renderFoot() {
  const foot = $("#sheet-foot");
  if (state.view === "cart") {
    foot.innerHTML = `${totalsHtml()}<button type="button" class="btn btn--fire btn--block" data-go="form">${t("cart.checkout")}</button>`;
  } else if (state.view === "form") {
    foot.innerHTML = `${totalsHtml()}
      <button type="submit" form="order-form" class="btn btn--wa btn--block">${icon("wa")}<span>${t("order.send")}</span></button>
      <p class="note">${t("order.note")}</p>`;
  }
}

function payLabels(pay) {
  return pay === "cash"
    ? { label: t("order.phoneCash"), hint: t("order.phoneHintCash") }
    : { label: t("order.phone"), hint: t("order.phoneHint") };
}

function renderSheet() {
  const lines = cartLines();
  const head = $("#sheet-head");
  const body = $("#sheet-body");
  const foot = $("#sheet-foot");
  const count = lines.reduce((a, l) => a + l.qty, 0);

  if (state.view === "form" && !lines.length) state.view = "cart";

  const backBtn = state.view === "form"
    ? `<button type="button" class="icon-btn" data-go="cart" aria-label="${t("cart.back")}">${icon("back")}</button>` : "";
  const title = state.view === "form" ? t("order.title") : t("cart.title");
  head.innerHTML = `<span class="sheet__grab"></span>${backBtn}
    <h2 class="sheet__title" id="sheet-title">${title}${count && state.view !== "done" ? `<small>${count} ${t("cart.items")}</small>` : ""}</h2>
    <button type="button" class="icon-btn" data-close aria-label="${t("cart.close")}">${icon("close")}</button>`;

  if (state.view === "done") {
    body.innerHTML = `<div class="done">
      <div class="done__icon">${icon("check")}</div>
      <h3>${t("order.done.t")}</h3>
      <p>${t("order.done.d")}</p>
      <a class="btn btn--wa btn--block" href="${escapeHtml(state.lastWaUrl)}" target="_blank" rel="noopener">${icon("wa")}<span>${t("order.done.again")}</span></a>
      <button type="button" class="btn btn--ghost btn--block" data-clear-done>${t("order.done.new")}</button>
    </div>`;
    foot.hidden = true;
    return;
  }

  if (!lines.length) {
    body.innerHTML = `<div class="empty">${placeholderSvg()}<p>${t("cart.empty")}</p>
      <button type="button" class="btn btn--fire" data-to-menu>${t("cart.toMenu")}</button></div>`;
    foot.hidden = true;
    return;
  }

  foot.hidden = false;

  if (state.view === "cart") {
    body.innerHTML = freeBarHtml() + lines.map((l) => `
      <div class="line">
        <div class="line__img">${l.img ? `<img src="img/menu/${l.img}-s.webp" alt="" loading="lazy">` : ""}</div>
        <div>
          <p class="line__name">${escapeHtml(l.name)}</p>
          <div class="line__unit">${formatPrice(l.price)}</div>
          <div class="line__row">
            ${stepperHtml(l.key, l.qty, true)}
            <span class="line__sum">${formatPrice(l.price * l.qty)}</span>
          </div>
          <button type="button" class="line__del" data-del="${l.key}">${t("cart.remove")}</button>
        </div>
      </div>`).join("") + upsellHtml();
    renderFoot();
    return;
  }

  // ---- Тапсырыс формасы ----
  const o = state.order;
  const branchOpts = pickupBranches().map((b) =>
    `<option value="${b.id}" ${o.branch === b.id ? "selected" : ""}>${escapeHtml(branchText(b))}</option>`).join("");
  const zoneOpts = DELIVERY_ZONES.map((z) =>
    `<option value="${z.id}" ${o.zone === z.id ? "selected" : ""}>${escapeHtml(zoneLabel(z))}</option>`).join("");
  const phone = payLabels(o.pay);
  body.innerHTML = `<form class="form" id="order-form" novalidate>
    <div class="field">
      <span class="field__label" id="lbl-type">${t("order.type")}</span>
      <div class="seg" role="group" aria-labelledby="lbl-type">
        <button type="button" class="seg__btn" data-type="pickup" aria-pressed="${o.type === "pickup"}">${icon("walk")}<span>${t("order.pickup")}</span></button>
        <button type="button" class="seg__btn" data-type="delivery" aria-pressed="${o.type === "delivery"}">${icon("scooter")}<span>${t("order.delivery")}</span></button>
      </div>
    </div>
    ${o.type === "pickup" ? `
    <div class="field" data-field="branch">
      <label class="field__label" for="f-branch">${t("order.branch")}</label>
      <select class="input" id="f-branch" name="branch" required>
        <option value="" ${o.branch ? "" : "selected"} disabled>${t("order.branchPh")}</option>${branchOpts}
      </select>
      <span class="field__err">${t("order.err.branch")}</span>
    </div>` : `
    ${freeBarHtml()}
    <div class="field" data-field="zone">
      <label class="field__label" for="f-zone">${t("order.zone")}</label>
      <select class="input" id="f-zone" name="zone" required>
        <option value="" ${o.zone ? "" : "selected"} disabled>${t("order.zonePh")}</option>${zoneOpts}
      </select>
      <span class="field__err">${t("order.err.zone")}</span>
    </div>
    <div class="field" data-field="address">
      <label class="field__label" for="f-address">${t("order.address")}</label>
      <input class="input" id="f-address" name="address" autocomplete="street-address" placeholder="${t("order.addressPh")}" value="${escapeHtml(o.address || "")}" required>
      <span class="field__err">${t("order.err.address")}</span>
    </div>`}
    <div class="field" data-field="name">
      <label class="field__label" for="f-name">${t("order.name")}</label>
      <input class="input" id="f-name" name="name" autocomplete="given-name" placeholder="${t("order.namePh")}" value="${escapeHtml(o.name || "")}" maxlength="60" required>
      <span class="field__err">${t("order.err.name")}</span>
    </div>
    <div class="field">
      <span class="field__label" id="lbl-pay">${t("order.pay")}</span>
      <div class="seg seg--3 bank" role="group" aria-labelledby="lbl-pay">
        <button type="button" class="seg__btn" data-pay="kaspi" aria-pressed="${o.pay === "kaspi"}"><span class="bank__dot"></span>Kaspi</button>
        <button type="button" class="seg__btn" data-pay="halyk" aria-pressed="${o.pay === "halyk"}"><span class="bank__dot"></span>Halyk</button>
        <button type="button" class="seg__btn" data-pay="cash" aria-pressed="${o.pay === "cash"}"><span class="bank__dot"></span>${t("order.cash")}</button>
      </div>
    </div>
    <div class="field" data-field="phone">
      <label class="field__label" for="f-phone" id="lbl-phone">${phone.label}</label>
      <span class="field__hint" id="hint-phone">${phone.hint}</span>
      <input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 7__ ___ __ __" value="${escapeHtml(o.phone || "")}" required>
      <span class="field__err">${t("order.err.phone")}</span>
    </div>
    <div class="field">
      <label class="field__label" for="f-comment">${t("order.comment")} <small>(${t("order.optional")})</small></label>
      <textarea class="input" id="f-comment" name="comment" rows="3" maxlength="500" placeholder="${t("order.commentPh")}">${escapeHtml(o.comment || "")}</textarea>
    </div>
  </form>`;
  renderFoot();
}

// ---------- Уақыт (Ақтау, UTC+5) — филиалдың ашық/жабық күйі үшін ----------
function aktauNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Aqtau", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return { h: +get("hour") % 24, m: +get("minute") };
}

// ---------- Телефон ----------
// "+7 8701…", "8701…", "+7701…", "7701…" — бәрі 7XXXXXXXXXX болады
function phoneDigits(v) {
  const raw = String(v || "").trim();
  let rest;
  if (raw.startsWith("+7")) {
    rest = raw.slice(2).replace(/\D/g, "");
  } else {
    const d = raw.replace(/\D/g, "");
    rest = d.length !== 10 && (d[0] === "8" || d[0] === "7") ? d.slice(1) : d;
  }
  if (rest.startsWith("8")) rest = rest.slice(1);                 // +7 кейін жазылған 8
  if (rest.length > 10 && rest.startsWith("7")) rest = rest.slice(1); // +7 кейін қайта жазылған 7
  if (!raw) return "";
  return "7" + rest.slice(0, 10);
}

function formatPhone(v) {
  const d = phoneDigits(v);
  if (!d) return "";
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = p[0] ? "+7" : "+7 ";
  if (p[0]) out += " " + p[0];
  if (p[1]) out += " " + p[1];
  if (p[2]) out += " " + p[2];
  if (p[3]) out += " " + p[3];
  return out;
}

// ---------- Форманы оқу / тексеру ----------
function readForm() {
  const f = $("#order-form");
  if (!f) return;
  const o = state.order;
  const val = (n) => (f.elements[n] ? f.elements[n].value.trim() : undefined);
  if (o.type === "pickup") {
    o.branch = val("branch") || o.branch;
  } else {
    o.zone = val("zone") || o.zone;
    o.address = val("address");
  }
  o.name = val("name");
  o.phone = val("phone");
  o.comment = val("comment");
}

function validate() {
  const o = state.order;
  const errors = {
    branch: o.type === "pickup" && !o.branch,
    zone: o.type === "delivery" && !zoneById(o.zone),
    address: o.type === "delivery" && (!o.address || o.address.length < 2),
    name: !o.name || o.name.length < 2,
    phone: phoneDigits(o.phone || "").length !== 11,
  };
  let first = null;
  for (const [name, bad] of Object.entries(errors)) {
    const field = $(`[data-field="${name}"]`);
    if (!field) continue;
    field.classList.toggle("is-invalid", bad);
    const input = $(".input", field);
    if (input) input.setAttribute("aria-invalid", String(bad));
    if (bad && !first) first = input;
  }
  if (first) {
    first.focus();
    first.scrollIntoView({ block: "center", behavior: "smooth" });
    return false;
  }
  return true;
}

// Хабарламаны басқа тілде құрастыру (ағылшынша таңдаса да, қызметкерлерге орысша кетеді)
function inLang(lang, fn) {
  const prev = LANG;
  LANG = lang;
  try { return fn(); } finally { LANG = prev; }
}

function buildMessage() {
  const o = state.order;
  const lines = cartLines();
  const sub = cartTotal();
  const out = [];
  out.push(`*${t("wa.head")}*`, "");
  out.push(`*${t("wa.items")}:*`);
  lines.forEach((l, i) => {
    out.push(`${i + 1}. ${l.name} — ${l.qty} ${t("wa.pcs")} × ${formatPrice(l.price)} = ${formatPrice(l.price * l.qty)}`);
  });
  out.push("");
  if (o.type === "delivery") {
    const d = deliveryInfo();
    out.push(`${t("wa.subtotal")}: ${formatPrice(sub)}`);
    out.push(`${t("wa.delivery")}: ${deliveryText(d)}`);
    out.push(`*${t("wa.total")}: ${formatPrice(sub + d.fee)}${d.known ? "" : " + " + t("cart.delivery").toLowerCase()}*`, "");
  } else {
    out.push(`*${t("wa.total")}: ${formatPrice(sub)}*`, "");
  }
  out.push(`*${t("wa.client")}:*`);
  out.push(`${t("wa.type")}: ${o.type === "pickup" ? t("order.pickup") : t("order.delivery")}`);
  if (o.type === "pickup") {
    const b = BRANCHES.find((x) => x.id === o.branch);
    if (b) out.push(`${t("wa.branch")}: ${branchText(b)}`);
  } else {
    const z = zoneById(o.zone);
    if (z) out.push(`${t("wa.zone")}: ${tr(z)}`);
    out.push(`${t("wa.address")}: ${o.address}`);
  }
  out.push(`${t("wa.name")}: ${o.name}`);
  if (o.pay === "cash") {
    out.push(`${t("wa.pay")}: ${t("order.cash")}`);
    out.push(`${t("wa.contact")}: ${formatPhone(o.phone)}`);
  } else {
    out.push(`${t("wa.pay")}: ${o.pay === "halyk" ? "Halyk" : "Kaspi"} (${t("wa.remote")})`);
    out.push(`${t("wa.phone")}: ${formatPhone(o.phone)}`);
  }
  if (o.comment) out.push(`${t("wa.comment")}: ${o.comment}`);
  return out.join("\n");
}

// ---------- «Жеткізу тегін» 3D анимациясы ----------
let wasFree = null;

function checkFree() {
  const free = cartTotal() >= FREE_DELIVERY_FROM;
  if (wasFree === false && free) celebrate();
  wasFree = free;
}

function celebrate() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    toast(`${t("free.done")} ${t("free.doneSub")}`);
    return;
  }
  const old = $(".party");
  if (old) old.remove();
  let sparksHtml = "";
  for (let i = 0; i < 26; i++) {
    const a = (Math.PI * 2 * i) / 26;
    const r = 120 + Math.random() * 110;
    sparksHtml += `<i style="--dx:${Math.round(Math.cos(a) * r)}px;--dy:${Math.round(Math.sin(a) * r)}px;--dz:${Math.round(Math.random() * 160 - 40)}px;--d:${(0.7 + Math.random() * 0.5).toFixed(2)}s"></i>`;
  }
  const face = (cls, inner) => `<div class="cube__face ${cls}">${inner}</div>`;
  const flame = `<svg viewBox="0 0 40 44" aria-hidden="true"><path d="${FLAME_PATH}" fill="#fff"/></svg>`;
  const el = document.createElement("div");
  el.className = "party";
  el.setAttribute("role", "status");
  el.innerHTML = `<div class="party__stage">
      <div class="party__sparks">${sparksHtml}</div>
      <div class="cube">
        ${face("cube__face--front", "<b>0 ₸</b>")}
        ${face("cube__face--back", "<b>0 ₸</b>")}
        ${face("cube__face--right", icon("scooter"))}
        ${face("cube__face--left", flame)}
        ${face("cube__face--top", flame)}
        ${face("cube__face--bottom", "")}
      </div>
    </div>
    <p class="party__title">${t("free.done")}</p>
    <p class="party__sub">${t("free.doneSub")}</p>`;
  document.body.appendChild(el);
  const close = () => {
    el.classList.add("is-out");
    setTimeout(() => el.remove(), 400);
  };
  el.addEventListener("click", close);
  setTimeout(close, 3200);
}

function bindSheet() {
  const sheet = $("#sheet");

  sheet.addEventListener("click", (e) => {
    const el = e.target;
    if (el.closest("[data-close]") || el.classList.contains("sheet__overlay")) return closeSheet();
    const go = el.closest("[data-go]");
    if (go) {
      readForm();
      state.view = go.dataset.go;
      renderSheet();
      $("#sheet-body").scrollTop = 0;
      return;
    }
    if (el.closest("[data-to-menu]")) {
      closeSheet();
      $("#menu").scrollIntoView({ behavior: "smooth" });
      return;
    }
    const inc = el.closest("[data-inc]");
    const dec = el.closest("[data-dec]");
    const del = el.closest("[data-del]");
    if (inc || dec || del) {
      const key = (inc || dec || del).dataset[inc ? "inc" : dec ? "dec" : "del"];
      setQty(key, del ? 0 : (state.cart[key] || 0) + (dec ? -1 : 1));
      return;
    }
    const type = el.closest("[data-type]");
    if (type) {
      readForm();
      state.order.type = type.dataset.type;
      renderSheet();
      const first = $(state.order.type === "pickup" ? "#f-branch" : "#f-address");
      if (first) first.focus();
      return;
    }
    const pay = el.closest("[data-pay]");
    if (pay) {
      state.order.pay = pay.dataset.pay;
      $$("[data-pay]").forEach((b) => b.setAttribute("aria-pressed", String(b === pay)));
      const labels = payLabels(state.order.pay);
      $("#lbl-phone").textContent = labels.label;
      $("#hint-phone").textContent = labels.hint;
      return;
    }
    const up = el.closest("[data-upsell]");
    if (up) {
      setQty(up.dataset.upsell, (state.cart[up.dataset.upsell] || 0) + 1);
      bumpFab();
      return;
    }
    if (el.closest("[data-clear-done]")) {
      state.cart = {};
      saveCart();
      renderMenu();
      closeSheet();
    }
  });

  sheet.addEventListener("input", (e) => {
    if (e.target.id === "f-phone" && e.inputType !== "deleteContentBackward") {
      e.target.value = formatPhone(e.target.value);
    }
    const field = e.target.closest(".field.is-invalid");
    if (field) field.classList.remove("is-invalid");
  });

  sheet.addEventListener("change", (e) => {
    if (e.target.id === "f-zone") {
      readForm();
      renderFoot();
    }
  });

  sheet.addEventListener("focusin", (e) => {
    if (e.target.id === "f-phone" && !e.target.value) e.target.value = "+7 ";
  });

  sheet.addEventListener("submit", (e) => {
    e.preventDefault();
    readForm();
    if (!validate()) return;
    const url = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(inLang(LANG === "en" ? "ru" : LANG, buildMessage))}`;
    state.lastWaUrl = url;
    state.view = "done";
    renderSheet();
    // телефонда (Instagram браузері де) — сол бетте ашамыз, компьютерде — жаңа қойындыда
    const win = matchMedia("(pointer: coarse)").matches ? null : window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  });

  document.addEventListener("keydown", (e) => {
    if (!sheet.classList.contains("is-open")) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "Tab") {
      // фокус шторкадан шықпасын
      const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', sheet)
        .filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  $("#fab").addEventListener("click", () => openSheet("cart"));
  $$("[data-open-cart]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openSheet("cart"); }));
}

// «ЖК Дукат, 17 мкр, 1» / «27 мкр, 10/1» — атау мекенжайда болса, қайталамаймыз
function branchText(b) {
  const name = tr(b.name);
  const addr = tr(b.addr);
  return addr.startsWith(name) ? addr : `${name}, ${addr}`;
}

// «Өзім аламын» қолжетімді филиалдар
function pickupBranches() {
  const list = BRANCHES.filter((b) => b.pickup);
  return list.length ? list : BRANCHES;
}

// ---------- Филиалдар ----------
function isOpen(b) {
  if (b.allDay) return true;
  const { h, m } = aktauNow();
  const now = h * 60 + m;
  return b.close > b.open ? now >= b.open && now < b.close : now >= b.open || now < b.close;
}

function renderBranches() {
  $("#branches").innerHTML = BRANCHES.map((b) => {
    const open = isOpen(b);
    return `<article class="branch">
      <span class="status ${open ? "status--open" : "status--closed"}">${t(open ? "contacts.openNow" : "contacts.closed")}</span>
      <h3 class="branch__name">${escapeHtml(tr(b.name))}</h3>
      <p class="branch__addr">${escapeHtml(tr(b.addr))}</p>
      <p class="branch__hours">${icon("clock")}<span>${escapeHtml(tr(b.hours))}</span></p>
      <div class="branch__foot"><a class="btn btn--ghost btn--block" href="${b.link}" target="_blank" rel="noopener">${icon("map")}<span>${t("contacts.2gis")}</span></a></div>
    </article>`;
  }).join("");
}

// ---------- Стоп-лист ----------
// Стопқа түскен тағамдар корзинадан алынады
function pruneStopped() {
  const removed = Object.keys(state.cart).filter((key) => StopList.hasKey(key));
  if (!removed.length) return false;
  removed.forEach((key) => delete state.cart[key]);
  saveCart();
  return true;
}

async function refreshStopList({ quiet = false } = {}) {
  if (!StopList.configured()) return;
  try {
    await StopList.load();
  } catch (e) {
    console.error(e);
    return;
  }
  renderMenu();
  const changed = pruneStopped();
  if ($("#sheet").classList.contains("is-open")) renderSheet();
  if (changed && !quiet) toast(t("cart.stopRemoved"));
}

function toast(text) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("is-on");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-on"), 5000);
}

// ---------- Ұшқындар ----------
function sparks() {
  const box = $(".sparks");
  if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const n = innerWidth < 700 ? 12 : 22;
  let html = "";
  for (let i = 0; i < n; i++) {
    const left = 4 + Math.random() * 92;
    const d = 4 + Math.random() * 5;
    const delay = Math.random() * 6;
    const x = (Math.random() - 0.5) * 160;
    const s = 2 + Math.random() * 3;
    html += `<i style="left:${left}%;--d:${d}s;--delay:${delay}s;--x:${x}px;width:${s}px;height:${s}px"></i>`;
  }
  box.innerHTML = html;
}

// ---------- Логотип тінтуірге қарай қисаяды ----------
function logoTilt() {
  const hero = $(".hero");
  const logo = $(".hero__logo");
  if (!hero || !logo || matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
  hero.addEventListener("pointermove", (e) => {
    const r = logo.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    logo.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
  });
  hero.addEventListener("pointerleave", () => { logo.style.transform = ""; });
}

// ---------- 24/7 филиалдар (hero астында) ----------
function renderClockPlaces() {
  const box = $("#clock-places");
  if (!box) return;
  box.innerHTML = BRANCHES.filter((b) => b.allDay).map((b) => {
    const text = branchText(b);
    return `<a class="clock__place" href="${b.link}" target="_blank" rel="noopener">${icon("pin")}<span>${escapeHtml(text)}</span></a>`;
  }).join("");
}

// ---------- Акция баннерлері ----------
function bindPromos() {
  $$("[data-promo-cat]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    $("#menu").scrollIntoView({ behavior: "smooth" });
    selectCat(a.dataset.promoCat);
  }));
}

// ---------- Бастау ----------
function renderAll() {
  renderTabs();
  renderMenu();
  renderFab();
  renderBranches();
  renderClockPlaces();
  if ($("#sheet").classList.contains("is-open")) { readForm(); renderSheet(); }
}

document.addEventListener("DOMContentLoaded", () => {
  $("#wa-link").href = `https://wa.me/${CFG.whatsapp}`;
  $("#ig-link").href = CFG.instagram;
  bindMenu();
  bindSheet();
  bindPromos();
  renderAll();
  sparks();
  logoTilt();
  saveCart();
  refreshStopList({ quiet: true });
  setInterval(() => refreshStopList(), 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshStopList(); });
  if (new URLSearchParams(location.search).get("cart") === "1") {
    history.replaceState(null, "", location.pathname + location.hash);
    openSheet("cart");
  }
});

document.addEventListener("langchange", renderAll);

// басқа бетте корзина өзгерсе — синхрондау
window.addEventListener("storage", (e) => {
  if (e.key !== CART_KEY) return;
  state.cart = readCart();
  renderMenu();
  renderFab();
  updateCartBadge(state.cart);
});

setInterval(renderBranches, 60 * 1000);
