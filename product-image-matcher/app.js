const DATA_URL = "../akel-melamin-design-system/project/ui_kits/website/data/products.json";
const IMG_BASE = "../akel-melamin-design-system/project/ui_kits/website/img/";
const STORAGE_KEY = "akel-image-matcher-draft-v1";

const els = {
  seriesList: document.getElementById("seriesList"),
  seriesMeta: document.getElementById("seriesMeta"),
  activeSeriesName: document.getElementById("activeSeriesName"),
  productMeta: document.getElementById("productMeta"),
  productSearch: document.getElementById("productSearch"),
  productList: document.getElementById("productList"),
  selectionStrip: document.getElementById("selectionStrip"),
  imageTitle: document.getElementById("imageTitle"),
  imageSearch: document.getElementById("imageSearch"),
  imageGrid: document.getElementById("imageGrid"),
  changeCount: document.getElementById("changeCount"),
  exportJson: document.getElementById("exportJson"),
  exportCsv: document.getElementById("exportCsv"),
  resetDraft: document.getElementById("resetDraft"),
  toast: document.getElementById("toast"),
};

const state = {
  categories: [],
  products: [],
  images: [],
  imageByKey: new Map(),
  assignments: {},
  activeCategory: "all",
  activeProductId: null,
  productQuery: "",
  imageQuery: "",
  imageMode: "series",
  useSourceImages: false,
  sourceDir: "",
};

function imgSrc(imageKey) {
  const image = state.imageByKey.get(imageKey);
  if (image && image.thumb) return image.thumb;
  return `${IMG_BASE}${imageKey}.webp`;
}

function imageMeta(imageKey) {
  return state.imageByKey.get(imageKey) || null;
}

function normalize(value) {
  return String(value || "").toLocaleLowerCase("tr-TR");
}

function productTitle(product) {
  return product.ad_tr || product.ad_en || product.sku || "Isimsiz urun";
}

function productId(product, index) {
  return `${index}__${product.sku || "sku"}__${product.foto_dosya_adi || "image"}`;
}

function currentImage(product) {
  return state.assignments[product._id] || product.foto_dosya_adi;
}

function categoryLabel(key) {
  if (key === "all") return "Tum seriler";
  const hit = state.categories.find((category) => category.key === key);
  return hit ? hit.tr : key;
}

function visibleProducts() {
  const query = normalize(state.productQuery);
  return state.products.filter((product) => {
    const inCategory = state.activeCategory === "all" || product.kategori === state.activeCategory;
    if (!inCategory) return false;
    if (!query) return true;
    const haystack = normalize([
      product.sku,
      product.ad_tr,
      product.ad_en,
      product.kategori,
      currentImage(product),
    ].join(" "));
    return haystack.includes(query);
  });
}

function visibleImages() {
  const query = normalize(state.imageQuery);
  const categoryScoped = !state.useSourceImages && state.imageMode === "series" && state.activeCategory !== "all";
  return state.images.filter((image) => {
    if (categoryScoped && image.category !== state.activeCategory) return false;
    if (!query) return true;
    const haystack = normalize([image.key, image.owner, image.sku, image.category].join(" "));
    return haystack.includes(query);
  });
}

function changes() {
  return state.products
    .map((product) => {
      const next = currentImage(product);
      if (next === product.foto_dosya_adi) return null;
      return {
        sku: product.sku || "",
        kategori: product.kategori || "",
        ad_tr: product.ad_tr || "",
        eski_foto_dosya_adi: product.foto_dosya_adi || "",
        yeni_foto_dosya_adi: next,
        secilen_imaj_dosyasi: imageMeta(next)?.name || next,
        secilen_imaj_yolu: imageMeta(next)?.sourcePath || "",
      };
    })
    .filter(Boolean);
}

function assignedCounts() {
  const counts = new Map();
  state.products.forEach((product) => {
    const key = currentImage(product);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.assignments));
}

function loadDraft() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function fallbackImage(event, key) {
  const img = event.currentTarget;
  if (imageMeta(key)) {
    img.style.opacity = "0.18";
    return;
  }
  if (!img.dataset.tryPng) {
    img.dataset.tryPng = "1";
    img.src = `${IMG_BASE}${key}.png`;
    return;
  }
  if (!img.dataset.tryJpg) {
    img.dataset.tryJpg = "1";
    img.src = `${IMG_BASE}${key}.jpg`;
    return;
  }
  img.style.opacity = "0.18";
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, 1800);
}

function renderSeries() {
  const counts = new Map();
  state.products.forEach((product) => {
    counts.set(product.kategori, (counts.get(product.kategori) || 0) + 1);
  });

  const entries = [
    { key: "all", tr: "Tum seriler", count: state.products.length },
    ...state.categories.map((category) => ({
      ...category,
      count: counts.get(category.key) || 0,
    })),
  ];

  els.seriesMeta.textContent = `${state.categories.length} seri`;
  els.seriesList.innerHTML = "";

  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `series-button ${entry.key === state.activeCategory ? "is-active" : ""}`;
    button.innerHTML = `<strong>${entry.tr}</strong><span>${entry.count}</span>`;
    button.addEventListener("click", () => {
      state.activeCategory = entry.key;
      state.activeProductId = null;
      render();
    });
    els.seriesList.appendChild(button);
  });
}

function renderProducts() {
  const products = visibleProducts();
  els.activeSeriesName.textContent = categoryLabel(state.activeCategory);
  els.productMeta.textContent = `${products.length} urun`;
  els.productList.innerHTML = "";

  if (!products.length) {
    els.productList.innerHTML = `<div class="empty-note">Bu filtrede urun yok.</div>`;
    return;
  }

  products.forEach((product) => {
    const imageKey = currentImage(product);
    const changed = imageKey !== product.foto_dosya_adi;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `product-button ${product._id === state.activeProductId ? "is-active" : ""}`;
    button.innerHTML = `
      <img class="product-thumb" src="${imgSrc(imageKey)}" alt="" loading="lazy">
      <span class="product-text">
        <span class="product-name">${productTitle(product)}</span>
        <span class="product-sub">
          <span>#${product.sku || "-"}</span>
          <span>${imageKey}</span>
          ${changed ? '<span class="changed-badge">degisti</span>' : ""}
        </span>
      </span>
    `;
    button.querySelector("img").addEventListener("error", (event) => fallbackImage(event, imageKey));
    button.addEventListener("click", () => {
      state.activeProductId = product._id;
      renderSelection();
      renderImages();
    });
    els.productList.appendChild(button);
  });
}

function renderSelection() {
  const product = state.products.find((item) => item._id === state.activeProductId);
  if (!product) {
    els.selectionStrip.innerHTML = `
      <div class="empty-selection">
        <i data-lucide="mouse-pointer-2"></i>
        <span>Once soldan bir urun sec.</span>
      </div>
    `;
    refreshIcons();
    return;
  }

  const imageKey = currentImage(product);
  const changed = imageKey !== product.foto_dosya_adi;
  els.selectionStrip.innerHTML = `
    <div class="selection-card">
      <img class="selection-image" src="${imgSrc(imageKey)}" alt="">
      <div class="selection-info">
        <p class="eyebrow">${categoryLabel(product.kategori)} / #${product.sku || "-"}</p>
        <h2>${productTitle(product)}</h2>
        <p>Mevcut imaj: ${product.foto_dosya_adi || "-"} / Secilen imaj: ${imageKey}</p>
        ${changed ? '<div class="change-row"><i data-lucide="check-circle-2"></i><span>Bu urun icin yeni imaj secildi.</span></div>' : ""}
      </div>
      <img class="selection-image" src="${imgSrc(product.foto_dosya_adi)}" alt="">
    </div>
  `;
  els.selectionStrip.querySelectorAll("img").forEach((img) => {
    const key = img.src.includes(imageKey) ? imageKey : product.foto_dosya_adi;
    img.addEventListener("error", (event) => fallbackImage(event, key));
  });
  refreshIcons();
}

function renderImages() {
  const images = visibleImages();
  const product = state.products.find((item) => item._id === state.activeProductId);
  const selectedKey = product ? currentImage(product) : null;
  const counts = assignedCounts();

  els.imageTitle.textContent = state.useSourceImages
    ? "IMAJ FOTOĞRAFLAR"
    : state.imageMode === "series" && state.activeCategory !== "all"
    ? `${categoryLabel(state.activeCategory)} imajlari`
    : "Tum imajlar";
  els.imageGrid.innerHTML = "";

  if (!images.length) {
    els.imageGrid.innerHTML = `<div class="empty-note">Bu filtrede imaj yok.</div>`;
    return;
  }

  images.forEach((image) => {
    const count = counts.get(image.key) || 0;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `image-card ${selectedKey === image.key ? "is-selected" : ""}`;
    button.innerHTML = `
      <span class="image-card__count ${count > 1 ? "is-warning" : ""}">${count}</span>
      <span class="image-card__frame">
        <img src="${imgSrc(image.key)}" alt="${image.key}" loading="lazy">
      </span>
      <span class="image-card__body">
        <span class="image-card__name">${image.key}</span>
        <span class="image-card__owner">${image.owner}</span>
      </span>
    `;
    button.querySelector("img").addEventListener("error", (event) => fallbackImage(event, image.key));
    button.addEventListener("click", () => assignImage(image.key));
    els.imageGrid.appendChild(button);
  });
}

function renderActions() {
  const count = changes().length;
  els.changeCount.textContent = `${count} degisiklik`;
  els.changeCount.classList.toggle("has-changes", count > 0);
  els.exportJson.disabled = count === 0;
  els.exportCsv.disabled = count === 0;
  els.resetDraft.disabled = count === 0;
}

function render() {
  renderSeries();
  renderProducts();
  renderSelection();
  renderImages();
  renderActions();
  refreshIcons();
}

function assignImage(imageKey) {
  const product = state.products.find((item) => item._id === state.activeProductId);
  if (!product) {
    showToast("Once bir urun sec.");
    return;
  }
  if (imageKey === product.foto_dosya_adi) {
    delete state.assignments[product._id];
    showToast("Urun orijinal imajina alindi.");
  } else {
    state.assignments[product._id] = imageKey;
    showToast(`${product.sku || "Urun"} icin ${imageKey} secildi.`);
  }
  saveDraft();
  renderProducts();
  renderSelection();
  renderImages();
  renderActions();
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadFile(name, type, body) {
  const blob = new Blob([body], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportJson() {
  const payload = {
    generated_at: new Date().toISOString(),
    source: "product-image-matcher",
    changes: changes(),
  };
  downloadFile("akel-image-mapping-updates.json", "application/json", JSON.stringify(payload, null, 2));
}

function exportCsv() {
  const rows = [
    ["sku", "kategori", "ad_tr", "eski_foto_dosya_adi", "secilen_imaj_dosyasi", "secilen_imaj_yolu"],
    ...changes().map((item) => [
      item.sku,
      item.kategori,
      item.ad_tr,
      item.eski_foto_dosya_adi,
      item.secilen_imaj_dosyasi,
      item.secilen_imaj_yolu,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n";
  downloadFile("akel-image-mapping-updates.csv", "text/csv;charset=utf-8", csv);
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

window.addEventListener("load", refreshIcons);

function bindEvents() {
  els.productSearch.addEventListener("input", (event) => {
    state.productQuery = event.target.value;
    renderProducts();
  });
  els.imageSearch.addEventListener("input", (event) => {
    state.imageQuery = event.target.value;
    renderImages();
  });
  document.querySelectorAll("[data-image-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.imageMode = button.dataset.imageMode;
      document.querySelectorAll("[data-image-mode]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderImages();
    });
  });
  els.exportJson.addEventListener("click", exportJson);
  els.exportCsv.addEventListener("click", exportCsv);
  els.resetDraft.addEventListener("click", () => {
    if (!window.confirm("Secimleri sifirlamak istiyor musun?")) return;
    state.assignments = {};
    saveDraft();
    render();
    showToast("Taslak sifirlandi.");
  });
}

async function boot() {
  bindEvents();
  try {
    let data = window.MATCHER_DATA;
    if (!data) {
      const response = await fetch(DATA_URL, { cache: "no-cache" });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      data = await response.json();
    }
    state.categories = data.categories || [];
    state.assignments = loadDraft();
    state.products = (data.products || []).map((product, index) => ({
      ...product,
      _id: productId(product, index),
    }));

    if (window.SOURCE_IMAGES && Array.isArray(window.SOURCE_IMAGES.images)) {
      state.useSourceImages = true;
      state.sourceDir = window.SOURCE_IMAGES.sourceDir || "";
      state.imageMode = "all";
      document.querySelector(".segmented")?.remove();
      state.images = window.SOURCE_IMAGES.images.map((image) => ({
        key: image.name,
        category: "source",
        owner: `${image.name} / ${(image.sizeBytes / 1024 / 1024).toFixed(1)} MB`,
        ...image,
      }));
    } else {
      const byImage = new Map();
      state.products.forEach((product) => {
        if (!product.foto_dosya_adi || byImage.has(product.foto_dosya_adi)) return;
        byImage.set(product.foto_dosya_adi, {
          key: product.foto_dosya_adi,
          category: product.kategori,
          owner: productTitle(product),
          sku: product.sku,
        });
      });
      state.images = [...byImage.values()].sort((a, b) => a.key.localeCompare(b.key, "tr"));
    }
    state.imageByKey = new Map(state.images.map((image) => [image.key, image]));
    render();
  } catch (error) {
    els.productList.innerHTML = `<div class="empty-note">Veri okunamadi: ${error.message}</div>`;
    els.imageGrid.innerHTML = `<div class="empty-note">Bu araci repo kokunden yerel sunucu ile ac.</div>`;
    refreshIcons();
  }
}

boot();
