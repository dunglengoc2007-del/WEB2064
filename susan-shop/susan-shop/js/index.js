// ===== INDEX PAGE =====
const categoryIcons = {
  "Cà phê": "fas fa-coffee",
  "Trà sữa": "fas fa-wine-bottle",
  "Trà trái cây": "fas fa-apple-alt",
  "Đồ ăn vặt": "fas fa-cookie",
};

async function loadCategories() {
  try {
    const res = await fetch(API.categories);
    const categories = await res.json();
    const menu = document.getElementById("category-menu");

    menu.innerHTML = `
      <li class="ca-item active" data-id="">
        <i class="fas fa-th-large"></i> Tất cả
      </li>
      ${categories.map(c => `
        <li class="ca-item" data-id="${c.id}">
          <i class="${categoryIcons[c.name] || 'fas fa-tag'}"></i> ${c.name}
        </li>
      `).join("")}
    `;

    document.querySelectorAll(".ca-item").forEach(li => {
      li.addEventListener("click", () => {
        document.querySelectorAll(".ca-item").forEach(x => x.classList.remove("active"));
        li.classList.add("active");
        loadProducts(li.dataset.id);
      });
    });
  } catch (err) {
    console.error("Lỗi khi tải danh mục:", err);
  }
}

async function loadProducts(cateId = null) {
  const list = document.getElementById("product-list");
  list.innerHTML = `<div class="loading" style="grid-column:1/-1"><div class="spinner"></div> Đang tải sản phẩm...</div>`;

  try {
    const url = cateId ? `${API.products}?cate_id=${cateId}` : API.products;
    const res = await fetch(url);
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    list.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-exclamation-triangle"></i><p>Lỗi khi tải sản phẩm!</p></div>`;
  }
}

function renderProducts(products) {
  const list = document.getElementById("product-list");
  if (products.length === 0) {
    list.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-search"></i><p>Không tìm thấy sản phẩm nào.</p></div>`;
    return;
  }

  list.innerHTML = products.map(p => `
    <div class="product">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'">
        <span class="product-badge">Mới</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="detail">${p.detail}</p>
        <div class="product-price"><i class="fas fa-tag" style="font-size:0.85rem;color:var(--pink-400)"></i> ${formatVND(p.price)}</div>
        <button onclick="viewDetail('${p.id}')">
          <i class="fas fa-eye"></i> Xem chi tiết
        </button>
      </div>
    </div>
  `).join("");
}

async function searchProducts() {
  const keyword = document.getElementById("search-input").value.trim().toLowerCase();
  if (!keyword) { loadProducts(); return; }

  try {
    const res = await fetch(API.products);
    const products = await res.json();
    const kw = removeTones(keyword);
    const filtered = products.filter(p =>
      removeTones(p.name.toLowerCase()).includes(kw) ||
      removeTones(p.detail.toLowerCase()).includes(kw)
    );
    renderProducts(filtered);
    // Clear active category
    document.querySelectorAll(".ca-item").forEach(x => x.classList.remove("active"));
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err);
  }
}

function viewDetail(id) {
  window.location.href = `product_detail.html?id=${id}`;
}

// Allow search on Enter key
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") searchProducts();
    });
  }
  loadCategories();
  loadProducts();
});
