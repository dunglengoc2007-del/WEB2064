// ===== CART PAGE =====
async function loadCart() {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData) {
    showToast("Vui lòng đăng nhập để xem giỏ hàng!", "warning");
    setTimeout(() => window.location.href = "login.html", 1500);
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.getElementById("cart-items");
  const emptyState = document.getElementById("empty-cart");
  const cartCard = document.getElementById("cart-card");
  let total = 0;

  if (cart.length === 0) {
    cartCard.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  cartCard.style.display = "block";
  emptyState.style.display = "none";
  tbody.innerHTML = "";

  for (const item of cart) {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    tbody.innerHTML += `
      <tr>
        <td><img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'"></td>
        <td>
          <strong style="color:var(--pink-800)">${item.name}</strong><br>
          <small style="color:var(--gray-500)">${item.detail}</small><br>
          <span style="color:var(--pink-600);font-size:0.82rem;font-weight:700">${item.variant}</span>
        </td>
        <td style="font-weight:700;color:var(--pink-600)">${formatVND(item.price)}</td>
        <td>
          <button class="qty-btn" onclick="updateQuantity('${item.productId}', '${item.variantId}', -1)">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.productId}', '${item.variantId}', 1)">+</button>
        </td>
        <td style="font-weight:800;color:var(--pink-700)">${formatVND(subtotal)}</td>
        <td>
          <button class="remove-btn" onclick="removeItem('${item.productId}', '${item.variantId}')">
            <i class="fas fa-trash-alt"></i> Xóa
          </button>
        </td>
      </tr>
    `;
  }

  document.getElementById("cart-total-amount").textContent = formatVND(total);
}

function updateQuantity(productId, variantId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.productId == productId && i.variantId == variantId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => !(i.productId == productId && i.variantId == variantId));
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(productId, variantId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(i => !(i.productId == productId && i.variantId == variantId));
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Đã xóa sản phẩm khỏi giỏ hàng.", "info");
  loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);
