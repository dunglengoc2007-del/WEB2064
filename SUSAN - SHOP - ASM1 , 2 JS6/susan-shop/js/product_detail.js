// ===== PRODUCT DETAIL PAGE =====
function getProductId() {
  return new URLSearchParams(window.location.search).get("id");
}

async function loadProductDetail() {
  const id = getProductId();
  if (!id) { window.location.href = "index.html"; return; }

  const detailDiv = document.getElementById("product-detail");
  detailDiv.innerHTML = `<div class="loading"><div class="spinner"></div> Đang tải...</div>`;

  try {
    const [prodRes, variantRes] = await Promise.all([
      fetch(`${API.products}/${id}`),
      fetch(`${API.variants}?product_id=${id}`)
    ]);

    const product = await prodRes.json();
    const variants = await variantRes.json();

    detailDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'">
      <div class="pd-info">
        <h2>${product.name}</h2>
        <p><i class="fas fa-info-circle" style="color:var(--pink-400);margin-right:6px"></i>${product.detail}</p>
        
        <div style="background:var(--pink-50);border-radius:8px;padding:14px 16px;border:1px solid var(--pink-100);margin:8px 0;">
          <div style="font-size:0.85rem;color:var(--gray-500);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Giá từ</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--pink-600)">${formatVND(product.price)}</div>
        </div>

        <label><i class="fas fa-list-ul" style="margin-right:5px;color:var(--pink-400)"></i> Chọn phiên bản:</label>
        <select id="variant">
          ${variants.length > 0
            ? variants.map(v => `<option value="${v.id}" data-price="${v.price}" data-name="${v.variant_name}">
                ${v.variant_name} — ${formatVND(v.price)} (Còn ${v.quantity})
              </option>`).join("")
            : `<option value="default" data-price="${product.price}" data-name="Tiêu chuẩn">Tiêu chuẩn — ${formatVND(product.price)}</option>`
          }
        </select>

        <button onclick="addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', '${product.image}', '${product.detail.replace(/'/g, "\\'")}')">
          <i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng
        </button>

        <div style="margin-top:12px">
          <a href="index.html" style="color:var(--pink-600);font-weight:600;font-size:0.88rem;text-decoration:none;display:inline-flex;align-items:center;gap:5px;transition:color 0.2s" onmouseover="this.style.color='var(--pink-800)'" onmouseout="this.style.color='var(--pink-600)'">
            <i class="fas fa-arrow-left"></i> Quay lại cửa hàng
          </a>
        </div>
      </div>
    `;
  } catch (err) {
    detailDiv.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Lỗi khi tải sản phẩm!</p></div>`;
  }
}

function addToCart(productId, name, image, detail) {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData) {
    showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "warning");
    setTimeout(() => window.location.href = "login.html", 1500);
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const variantSelect = document.getElementById("variant");
  const variantId = variantSelect.value;
  const variantName = variantSelect.options[variantSelect.selectedIndex].dataset.name;
  const price = parseInt(variantSelect.options[variantSelect.selectedIndex].dataset.price);

  const item = cart.find(i => i.productId === productId && i.variantId == variantId);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ productId, name, image, detail, variantId, variant: variantName, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(`Đã thêm "${name}" vào giỏ hàng!`, "success");
}

document.addEventListener("DOMContentLoaded", loadProductDetail);
