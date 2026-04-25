// ===== ADMIN ORDERS =====
const API_ORDERS_ADMIN = "http://localhost:4000/orders";

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

const statusLabels = { pending: "Chờ xử lý", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy" };

async function loadOrders() {
  const list = document.getElementById("order-list");
  list.innerHTML = `<div class="loading"><div class="spinner"></div> Đang tải đơn hàng...</div>`;

  try {
    const res = await fetch(API_ORDERS_ADMIN);
    const orders = await res.json();

    if (orders.length === 0) {
      list.innerHTML = `<div class="empty-state"><i class="fas fa-receipt"></i><p>Chưa có đơn hàng nào.</p></div>`;
      return;
    }

    list.innerHTML = `
      <div class="admin-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${orders.reverse().map(order => `
              <tr>
                <td style="font-family:monospace;font-size:0.82rem;color:var(--pink-600)">${order.id}</td>
                <td style="color:var(--gray-500);font-size:0.85rem">${new Date(order.create_at).toLocaleString("vi-VN")}</td>
                <td>
                  <div style="font-weight:700;color:var(--pink-800)">${order.user?.name || "Không rõ"}</div>
                  <div style="font-size:0.8rem;color:var(--gray-500)">${order.user?.phone || ""}</div>
                </td>
                <td style="font-weight:800;color:var(--pink-700)">${formatVNDAdmin(order.total)}</td>
                <td>
                  <select class="status-select" onchange="updateStatus('${order.id}', this.value)">
                    <option value="pending" ${order.status === "pending" ? "selected" : ""}>Chờ xử lý</option>
                    <option value="shipping" ${order.status === "shipping" ? "selected" : ""}>Đang giao</option>
                    <option value="completed" ${order.status === "completed" ? "selected" : ""}>Hoàn thành</option>
                    <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Đã hủy</option>
                  </select>
                </td>
                <td>
                  <button class="action-btn view" onclick="viewDetails('${order.id}')"><i class="fas fa-eye"></i> Chi tiết</button>
                  <button class="action-btn delete" onclick="deleteOrder('${order.id}')"><i class="fas fa-trash"></i> Xóa</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Lỗi khi tải đơn hàng!</p></div>`;
  }
}

async function updateStatus(id, newStatus) {
  try {
    await fetch(`${API_ORDERS_ADMIN}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    showToastAdmin(`Đã cập nhật trạng thái thành "${statusLabels[newStatus]}"!`, "success");
  } catch (err) {
    showToastAdmin("Lỗi khi cập nhật trạng thái!", "error");
  }
}

function viewDetails(id) {
  window.location.href = `order_detail.html?id=${id}`;
}

async function deleteOrder(id) {
  if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
  try {
    await fetch(`${API_ORDERS_ADMIN}/${id}`, { method: "DELETE" });
    showToastAdmin("Đã xóa đơn hàng!", "success");
    loadOrders();
  } catch (err) {
    showToastAdmin("Lỗi khi xóa đơn hàng!", "error");
  }
}

document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", loadOrders);
