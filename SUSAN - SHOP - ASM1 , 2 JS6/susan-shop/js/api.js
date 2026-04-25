// ===== API Configuration =====
// Uses json-server: npx json-server --watch db.json --port 4000
const API_BASE = "http://localhost:4000";

const API = {
  products: `${API_BASE}/products`,
  categories: `${API_BASE}/categories`,
  users: `${API_BASE}/users`,
  orders: `${API_BASE}/orders`,
  variants: `${API_BASE}/product_variants`,
};

// Show toast notification
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle', warning: 'fas fa-exclamation-triangle' };
  const colors = { success: '#10b981', error: '#ef4444', info: '#ec4899', warning: '#f59e0b' };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = colors[type] || colors.info;
  toast.innerHTML = `<i class="${icons[type] || icons.info}" style="color:${colors[type] || colors.info};font-size:1.1rem;"></i><span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Vietnamese tone removal for search
function removeTones(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

// Format currency
function formatVND(amount) {
  return Number(amount).toLocaleString("vi-VN") + " ₫";
}
