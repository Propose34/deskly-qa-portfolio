import "./style.css";
import { products } from "./catalog";
import { productImage } from "./imagery";
const fixed = import.meta.env.VITE_APP_MODE === "fixed";
const money = (value: number) => `฿${value.toLocaleString("en-US")}`;
const cart: Record<string, number> = JSON.parse(
  localStorage.getItem("deskly-cart") || "{}",
);
let discount = 0;
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
$("#app").innerHTML = `
 <div class="announcement">A happier desk starts here. <span>Free shipping on orders ฿2,000+</span> <span class="spark">✦</span></div>
 <header><a href="/" class="logo" aria-label="Deskly home">deskly<span>✳</span></a><nav aria-label="Main navigation"><a href="#collection">The collection</a><a href="#our-story">Our philosophy</a></nav><button id="cart-open" class="bag" aria-label="Open bag">Bag <span id="cart-count">0</span> ↗</button></header>
 <main><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="dot"></span> SMALL THINGS. BETTER DAYS.</div><h1>Make room<br>for <em>good work.</em></h1><p>Thoughtful essentials for the place where<br class="desktop"> your ideas come to life. Less clutter. More you.</p><a href="#collection" class="primary">Find your desk essentials <span>↗</span></a><div class="hero-foot"><span>✧ Thoughtfully selected</span><span>♡ Made for the everyday</span></div></div><div class="hero-art"><div class="hero-label">THE FOCUS EDIT <span>01 / 06</span></div><div class="hero-photo">${productImage("lamp")}</div><div class="art-caption">Your space, a little more inspired. <span>↗</span></div><div class="sticker">good things<br><em>take space</em> ✦</div></div></section>
 <div class="values"><span>DESIGNED FOR YOUR EVERYDAY</span><span>✳</span><span>A LITTLE LESS ORDINARY</span><span>✳</span><span>SPACE TO DO YOUR THING</span></div>
 <section id="collection" class="collection"><div class="section-heading"><div><div class="eyebrow">THE EVERYDAY COLLECTION</div><h2>Your desk. <em>Your kind of calm.</em></h2></div><p>Good company for your 9 to whenever.</p></div><div class="toolbar"><div class="filters" role="group" aria-label="Product categories">${["All", "Lighting", "Tech", "Accessories", "Stationery"].map((c, i) => `<button data-category="${c}" class="${i === 0 ? "active" : ""}" aria-pressed="${i === 0}">${c}</button>`).join("")}</div><div class="tools"><label class="search">⌕ <input id="search" type="search" aria-label="Search products" placeholder="Find your next favorite"></label><select id="sort" aria-label="Sort products"><option value="featured">Featured</option><option value="asc">Price: low to high</option><option value="desc">Price: high to low</option></select></div></div><p id="results-count" class="results-count" aria-live="polite"></p><div id="products" class="product-grid"></div></section>
 <section id="our-story" class="story"><span class="story-symbol">✳</span><div><div class="eyebrow">A NOTE FROM DESKLY</div><h2>A good day starts<br>with a space that <em>feels like you.</em></h2><p>We believe the things you surround yourself with matter.<br>So we choose fewer, better things. Useful, beautiful, and a joy to keep.</p></div><span class="story-number">LESS, BUT<br>LOVELIER. ↗</span></section></main>
 <footer><a href="/" class="logo">deskly<span>✳</span></a><p>A little more intention. A little more you.</p><span>QA practice shop · ${fixed ? "Fixed" : "Buggy"} edition<br>No real payments or orders.</span></footer>
 <dialog id="bag-dialog" aria-labelledby="bag-title"><div class="dialog-header"><div><div class="eyebrow">YOUR GOOD THINGS</div><h2 id="bag-title">Shopping bag</h2></div><button id="cart-close" class="icon-button" aria-label="Close bag">✕</button></div><div id="bag-content"></div></dialog>
 <div id="toast" role="status" class="toast"></div>`;
let category = "All";
function renderProducts() {
  const search = $("#search") as HTMLInputElement;
  const query = search.value.trim();
  let list = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (fixed
        ? p.name.toLowerCase().includes(query.toLowerCase())
        : p.name.includes(query)),
  );
  const sort = ($("#sort") as HTMLSelectElement).value;
  // BUG-002: lexical comparison, rather than numeric price order.
  if (sort !== "featured")
    list.sort(
      (a, b) =>
        (fixed
          ? a.price - b.price
          : String(a.price).localeCompare(String(b.price))) *
        (sort === "asc" ? 1 : -1),
    );
  $("#results-count").textContent =
    `${list.length} thoughtfully chosen essentials`;
  $("#products").innerHTML = list.length
    ? list
        .map(
          (p) =>
            `<article class="product" data-testid="product-${p.id}"><div class="product-art" style="background:${p.color}"><span class="product-tag">${p.stock === 0 ? "OUT OF STOCK" : p.id === "lamp" ? "DESK FAVORITE" : p.category.toUpperCase()}</span>${productImage(p.id)}<button data-add="${p.id}" aria-label="Add ${p.name} to bag" ${p.stock === 0 ? "disabled" : ""}>${p.stock === 0 ? "Unavailable" : "＋"}</button></div><div class="product-heading"><h3>${p.name}</h3><span data-testid="price">${money(p.price)}</span></div><p>${p.note}</p></article>`,
        )
        .join("")
    : '<div class="empty"><h3>No essentials found</h3><p>Try another search or category.</p></div>';
}
function save() {
  localStorage.setItem("deskly-cart", JSON.stringify(cart));
  $("#cart-count").textContent = String(
    Object.values(cart).reduce((a, b) => a + b, 0),
  );
}
function subtotal() {
  return products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
}
function shipping() {
  return (fixed ? subtotal() >= 2000 : subtotal() > 2000) ? 0 : 100;
} // BUG-005: exclusive threshold.
function notify(message: string) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  window.setTimeout(() => $("#toast").classList.remove("visible"), 1800);
}
function renderBag() {
  const lines = products.filter((p) => cart[p.id]);
  if (!lines.length) {
    discount = 0;
    $("#bag-content").innerHTML =
      '<div class="empty"><span>♡</span><h3>Your bag is a blank canvas.</h3><p>Let’s find something good for your desk.</p><button id="continue" class="primary">Explore the collection ↗</button></div>';
    return;
  }
  const sub = subtotal(),
    off = sub * discount,
    ship = shipping();
  $("#bag-content").innerHTML =
    `<div class="cart-items">${lines.map((p) => `<div class="cart-item" data-testid="cart-${p.id}"><div class="cart-art" style="background:${p.color}">${productImage(p.id)}</div><div class="cart-detail"><h3>${p.name}</h3><p>${money(p.price)} · ${p.stock} available</p><div class="quantity"><button data-minus="${p.id}" aria-label="Decrease ${p.name}">−</button><span data-testid="quantity-${p.id}">${cart[p.id]}</span><button data-plus="${p.id}" aria-label="Increase ${p.name}" ${fixed && cart[p.id] >= p.stock ? "disabled" : ""}>＋</button><button data-remove="${p.id}" class="remove">Remove</button></div></div><strong>${money(p.price * cart[p.id])}</strong></div>`).join("")}</div><form id="coupon-form" class="coupon"><input name="coupon" aria-label="Promo code" placeholder="Promo code · try DESK10"><button>Apply</button></form><p id="coupon-status" role="status">${discount ? "DESK10 applied" : ""}</p><div class="totals"><div>Subtotal <span data-testid="subtotal">${money(sub)}</span></div><div>Discount <span data-testid="discount">−${money(off)}</span></div><div>Shipping <span data-testid="shipping">${money(ship)}</span></div><div class="total">Total <span data-testid="total">${money(sub - off + ship)}</span></div></div><details id="checkout"><summary>Checkout details ↗</summary><form id="checkout-form" novalidate><label>Full name<input name="name" autocomplete="name" required></label><label>Email address<input name="email" type="email" autocomplete="email" required></label><label>Delivery address<textarea name="address" autocomplete="street-address" required></textarea></label><p id="checkout-error" role="alert"></p><button class="primary">Place demo order ↗</button><small>Demo only. No payment will be collected.</small></form></details>`;
}
$("#search").addEventListener("input", renderProducts);
$("#sort").addEventListener("change", renderProducts);
$(".filters").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-category]",
  );
  if (!b) return;
  category = b.dataset.category!;
  document.querySelectorAll("[data-category]").forEach((el) => {
    const selected = (el as HTMLElement).dataset.category === category;
    el.classList.toggle("active", selected);
    el.setAttribute("aria-pressed", String(selected));
  });
  renderProducts();
});
$("#products").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-add]");
  if (!b || b.disabled) return;
  const id = b.dataset.add!;
  const p = products.find((p) => p.id === id)!;
  if (fixed && (cart[id] || 0) >= p.stock) {
    notify("Stock limit reached");
    return;
  }
  cart[id] = (cart[id] || 0) + 1;
  save();
  notify(`${p.name} added to your bag`);
});
const dialog = $<HTMLDialogElement>("#bag-dialog");
$("#cart-open").addEventListener("click", () => {
  renderBag();
  dialog.showModal();
});
$("#cart-close").addEventListener("click", () => dialog.close());
$("#bag-content").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
  if (!b) return;
  if (b.id === "continue") {
    dialog.close();
    $("#collection").scrollIntoView();
  }
  for (const action of ["plus", "minus", "remove"]) {
    const id = b.dataset[action];
    if (!id) continue;
    const p = products.find((p) => p.id === id)!;
    if (action === "plus" && (!fixed || cart[id] < p.stock)) cart[id]++;
    if (action === "minus") cart[id]--;
    if (action === "remove" || cart[id] <= 0) delete cart[id];
    save();
    renderBag();
  }
});
$("#bag-content").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const data = new FormData(form);
  if (form.id === "coupon-form") {
    if (String(data.get("coupon")).trim().toUpperCase() !== "DESK10") {
      $("#coupon-status").textContent = "Invalid promo code";
      return;
    }
    discount = fixed ? 0.1 : discount + 0.1; // BUG-004: repeated redemption stacks the discount.
    renderBag();
    return;
  }
  if (form.id === "checkout-form") {
    const name = String(data.get("name") || ""),
      email = String(data.get("email") || ""),
      address = String(data.get("address") || "");
    // BUG-006: whitespace satisfies required name/address in buggy mode.
    if (
      !(fixed ? name.trim() : name) ||
      !(fixed ? address.trim() : address) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      $("#checkout-error").textContent =
        "Enter a name, valid email, and delivery address.";
      return;
    }
    Object.keys(cart).forEach((id) => delete cart[id]);
    discount = 0;
    save();
    $("#bag-content").innerHTML =
      '<div class="empty" data-testid="order-success"><span>✧</span><h2>Your desk says thank you.</h2><p>Demo order confirmed. No payment was taken.</p></div>';
  }
});
save();
renderProducts();
