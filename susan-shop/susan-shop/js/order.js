// ===== ORDER PAGE =====
async function loadOrders() {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData) {
    showToast("Vui lòng đăng nhập để xem đơn hàng!", "warning");
    setTimeout(() => window.location.href = "login.html", 1500);
    return;
  }

  const list = document.getElementById("order-list");
  list.innerHTML = `<div class="loading"><div class="spinner"></div> Đang tải đơn hàng...</div>`;

  try {
    const res = await fetch(API.orders);
    const allOrders = await res.json();

    // Filter orders by user email
    const orders = allOrders.filter(o => o.user && o.user.email === userData.email);

    if (orders.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-receipt"></i>
          <p style="font-size:1.1rem;font-weight:700;color:var(--pink-700)">Chưa có đơn hàng nào</p>
          <p>Hãy khám phá menu và đặt hàng ngay!</p>
          <a href="index.html" style="display:inline-flex;align-items:center;gap:6px;margin-top:16px;padding:10px 24px;background:linear-gradient(135deg,var(--pink-500),var(--pink-600));color:white;border-radius:9999px;text-decoration:none;font-weight:700;font-size:0.9rem">
            <i class="fas fa-shopping-bag"></i> Mua ngay
          </a>
        </div>`;
      return;
    }

    const statusLabels = {
      pending: "Chờ xử lý",
      shipping: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };

    list.innerHTML = orders.reverse().map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <h3><i class="fas fa-receipt" style="color:var(--pink-500);margin-right:6px"></i>
              Mã đơn: <span class="order-id">${order.id}</span>
            </h3>
            <p><i class="fas fa-calendar-alt"></i> ${new Date(order.create_at).toLocaleString("vi-VN")}</p>
            <p>Trạng thái: <span class="status ${order.status}">${statusLabels[order.status] || order.status}</span></p>
          </div>
          <div class="order-total">
            Tổng tiền: <strong>${formatVND(order.total)}</strong>
          </div>
        </div>

        <div class="user-info">
          <p><i class="fas fa-user"></i> ${order.user.name}</p>
          <p><i class="fas fa-phone"></i> ${order.user.phone}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${order.user.address}</p>
        </div>

        <div class="order-items">
          ${order.items.map(item => `
            <div class="item">
              <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'">
              <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.detail}</p>
                <p>Phiên bản: <strong style="color:var(--pink-600)">${item.variant}</strong></p>
                <p style="color:var(--pink-700);font-weight:700">${formatVND(item.price)} × ${item.quantity}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Lỗi khi tải đơn hàng!</p></div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadOrders);
