// ===== CHECKOUT PAGE =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadCheckout() {
  const tbody = document.getElementById("checkout-items");
  let total = 0;
  tbody.innerHTML = "";

  for (const item of cart) {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    tbody.innerHTML += `
      <tr>
        <td>${item.name}<br><small style="color:var(--gray-500)">${item.variant}</small></td>
        <td><img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'"></td>
        <td>${formatVND(item.price)}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="font-weight:700;color:var(--pink-600)">${formatVND(subtotal)}</td>
      </tr>
    `;
  }

  document.getElementById("checkout-total").textContent = formatVND(total);
  return total;
}

document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  
  if (cart.length === 0) {
    showToast("Giỏ hàng của bạn đang trống!", "warning");
    setTimeout(() => window.location.href = "cart.html", 1500);
    return;
  }

  // Pre-fill user info if logged in
  if (userData) {
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const phoneEl = document.getElementById("phone");
    const addressEl = document.getElementById("address");
    if (nameEl) nameEl.value = userData.name || "";
    if (emailEl) emailEl.value = userData.email || "";
    if (phoneEl) phoneEl.value = userData.phone || "";
    if (addressEl) addressEl.value = userData.address || "";
  }

  loadCheckout();

  document.getElementById("checkout-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
    };

    const total = loadCheckout();

    const order = {
      user,
      total,
      items: cart,
      create_at: new Date().toISOString(),
      status: "pending",
    };

    try {
      const res = await fetch(API.orders, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        localStorage.removeItem("cart");
        window.location.href = "thankyou.html";
      } else {
        showToast("Lỗi khi đặt hàng! Vui lòng thử lại.", "error");
      }
    } catch (err) {
      showToast("Không thể kết nối đến server!", "error");
    }
  });
});
