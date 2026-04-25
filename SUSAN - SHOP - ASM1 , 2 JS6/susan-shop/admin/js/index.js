// ===== ADMIN DASHBOARD =====
const API_BASE_ADMIN = "http://localhost:4000";
const API_ADMIN = {
  categories: `${API_BASE_ADMIN}/categories`,
  products: `${API_BASE_ADMIN}/products`,
  users: `${API_BASE_ADMIN}/users`,
  orders: `${API_BASE_ADMIN}/orders`,
  variants: `${API_BASE_ADMIN}/product_variants`,
};

function showToastAdmin(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle' };
  const colors = { success: '#10b981', error: '#ef4444', info: '#ec4899' };
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
async function loadDashboard() {
  try {
    const [catRes, prodRes, userRes, orderRes, variantRes] = await Promise.all([
      fetch(API_ADMIN.categories),
      fetch(API_ADMIN.products),
      fetch(API_ADMIN.users),
      fetch(API_ADMIN.orders),
      fetch(API_ADMIN.variants),
    ]);
    const [categories, products, users, orders, variants] = await Promise.all([
      catRes.json(), prodRes.json(), userRes.json(), orderRes.json(), variantRes.json(),
    ]);
    document.getElementById("total-categories").textContent = categories.length;
    document.getElementById("total-products").textContent = products.length;
    document.getElementById("total-users").textContent = users.length;
    document.getElementById("total-orders").textContent = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    document.getElementById("total-revenue").textContent = formatVNDAdmin(totalRevenue);
    const lowStock = variants.filter(v => v.quantity <= 10);
    const lowStockList = document.getElementById("low-stock-list");
    if (lowStock.length === 0) {
      lowStockList.innerHTML = `<li style="color:var(--gray-500);font-style:italic">Không có sản phẩm sắp hết hàng</li>`;
    } else {
      lowStockList.innerHTML = lowStock.map(v => {
        const prod = products.find(p => p.id == v.product_id);
        return `<li>${prod ? prod.name : "?"} <span style="color:var(--pink-700);font-weight:700">(${v.variant_name})</span> — Còn <strong style="color:#ef4444">${v.quantity}</strong></li>`;
      }).join("");
    }
    const orderList = document.getElementById("order-list");
    const statusLabels = { pending: "Chờ xử lý", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy" };
    orderList.innerHTML = orders.slice(-5).reverse().map(o => `
      <tr>
        <td style="font-family:monospace;font-size:0.82rem;color:var(--pink-600)">${o.id}</td>
        <td>${o.user?.name || "Ẩn danh"}</td>
        <td style="font-weight:700;color:var(--pink-700)">${formatVNDAdmin(o.total)}</td>
        <td style="color:var(--gray-500)">${new Date(o.create_at).toLocaleDateString("vi-VN")}</td>
        <td><span class="status ${o.status}">${statusLabels[o.status] || o.status}</span></td>
      </tr>
    `).join("");
    const categoryCounts = categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => p.cate_id == cat.id).length
    }));
    renderChart(categoryCounts);
  } catch (err) {
    console.error("Lỗi tải dashboard:", err);
  }
}
function renderChart(data) {
  const ctx = document.getElementById("categoryChart");
  if (!ctx) return;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: "Số lượng sản phẩm",
        data: data.map(d => d.count),
        backgroundColor: ["rgba(236,72,153,0.7)", "rgba(244,63,94,0.7)", "rgba(168,85,247,0.7)", "rgba(59,130,246,0.7)"],
        borderColor: ["#ec4899", "#f43f5e", "#a855f7", "#3b82f6"],
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      },
      animation: { duration: 1000, easing: "easeOutQuart" }
    }
  });
}
document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  showToastAdmin("Đã đăng xuất!", "info");
  setTimeout(() => window.location.href = "login.html", 1000);
});
document.addEventListener("DOMContentLoaded", loadDashboard);