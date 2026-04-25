// ===== ADMIN ORDER DETAIL =====
const API_ORDERS_DETAIL = "http://localhost:4000/orders";

function showToastAdmin(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const colors = { success: '#10b981', error: '#ef4444', info: '#ec4899' };
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = colors[type] || colors.info;
  toast.innerHTML = `<i class="${icons[type]}" style="color:${colors[type]};font-size:1.1rem;"></i><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatVNDAdmin(amount) {
  return Number(amount).toLocaleString("vi-VN") + " ₫";
}

const adminUser = JSON.parse(localStorage.getItem("user"));
if (!adminUser || adminUser.role !== "admin") {
  window.location.href = "login.html";
}

const orderId = new URLSearchParams(window.location.search).get("id");
if (!orderId) window.location.href = "orders.html";

async function loadOrderDetail() {
  const detailDiv = document.getElementById("order-detail");
  detailDiv.innerHTML = `<div class="loading"><div class="spinner"></div> Đang tải...</div>`;

  try {
    const res = await fetch(`${API_ORDERS_DETAIL}/${orderId}`);
    const order = await res.json();
    const statusLabels = { pending: "Chờ xử lý", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy" };

    detailDiv.innerHTML = `
      <div class="admin-panel">
        <div class="panel-header">
          <h3><i class="fas fa-receipt"></i> Chi tiết đơn hàng: <span style="font-family:monospace;color:var(--pink-600)">${order.id}</span></h3>
          <div style="display:flex;align-items:center;gap:10px">
            <select id="order-status" class="status-select" style="padding:8px 14px">
              <option value="pending" ${order.status === "pending" ? "selected" : ""}>Chờ xử lý</option>
              <option value="shipping" ${order.status === "shipping" ? "selected" : ""}>Đang giao</option>
              <option value="completed" ${order.status === "completed" ? "selected" : ""}>Hoàn thành</option>
              <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Đã hủy</option>
            </select>
            <button class="action-btn view" onclick="updateStatus('${order.id}')">
              <i class="fas fa-save"></i> Lưu trạng thái
            </button>
          </div>
        </div>
        <div class="panel-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
            <div style="background:var(--pink-50);border-radius:8px;padding:16px;border:1px solid var(--pink-100)">
              <h4 style="color:var(--pink-700);font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <i class="fas fa-calendar-alt"></i> Thông tin đơn hàng
              </h4>
              <p style="font-size:0.88rem;margin-bottom:6px">Ngày đặt: <strong>${new Date(order.create_at).toLocaleString("vi-VN")}</strong></p>
              <p style="font-size:0.88rem;margin-bottom:6px">Trạng thái: <span class="status ${order.status}">${statusLabels[order.status] || order.status}</span></p>
              <p style="font-size:1.1rem;font-weight:800;color:var(--pink-600)">Tổng: ${formatVNDAdmin(order.total)}</p>
            </div>
            <div style="background:var(--pink-50);border-radius:8px;padding:16px;border:1px solid var(--pink-100)">
              <h4 style="color:var(--pink-700);font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <i class="fas fa-user"></i> Thông tin khách hàng
              </h4>
              <p style="font-size:0.88rem;margin-bottom:6px"><i class="fas fa-user" style="color:var(--pink-400);margin-right:5px;width:14px"></i>${order.user.name}</p>
              <p style="font-size:0.88rem;margin-bottom:6px"><i class="fas fa-phone" style="color:var(--pink-400);margin-right:5px;width:14px"></i>${order.user.phone}</p>
              <p style="font-size:0.88rem"><i class="fas fa-map-marker-alt" style="color:var(--pink-400);margin-right:5px;width:14px"></i>${order.user.address}</p>
            </div>
          </div>

          <h4 style="color:var(--pink-700);font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px">
            <i class="fas fa-box"></i> Sản phẩm đặt hàng
          </h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Phiên bản</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'"></td>
                  <td><strong>${item.name}</strong><br><small style="color:var(--gray-500)">${item.detail}</small></td>
                  <td><span style="background:var(--pink-100);color:var(--pink-700);padding:3px 10px;border-radius:9999px;font-size:0.8rem;font-weight:700">${item.variant}</span></td>
                  <td>${formatVNDAdmin(item.price)}</td>
                  <td style="text-align:center;font-weight:700">${item.quantity}</td>
                  <td style="font-weight:800;color:var(--pink-600)">${formatVNDAdmin(item.price * item.quantity)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div style="margin-top:20px;text-align:right">
            <button class="action-btn view" style="padding:10px 22px;font-size:0.9rem" onclick="backToList()">
              <i class="fas fa-arrow-left"></i> Quay lại
            </button>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    detailDiv.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Lỗi khi tải chi tiết đơn hàng!</p></div>`;
  }
}

async function updateStatus(id) {
  const newStatus = document.getElementById("order-status").value;
  const statusLabels = { pending: "Chờ xử lý", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy" };
  try {
    await fetch(`${API_ORDERS_DETAIL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    showToastAdmin(`Đã cập nhật: "${statusLabels[newStatus]}"`, "success");
    loadOrderDetail();
  } catch (err) {
    showToastAdmin("Lỗi khi cập nhật!", "error");
  }
}

function backToList() {
  window.location.href = "orders.html";
}

document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", loadOrderDetail);
