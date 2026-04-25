// ===== ADMIN PRODUCTS =====
const API_PRODUCTS_ADMIN = "http://localhost:4000/products";
const API_CATEGORIES_ADMIN = "http://localhost:4000/categories";

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

let editingId = null;
let categories = [];

async function loadProducts() {
  const tbody = document.getElementById("product-list");
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px"><div class="spinner" style="margin:0 auto"></div></td></tr>`;

  try {
    const [prodRes, catRes] = await Promise.all([
      fetch(API_PRODUCTS_ADMIN),
      fetch(API_CATEGORIES_ADMIN),
    ]);
    const products = await prodRes.json();
    categories = await catRes.json();

    // Populate category select in form
    const catSelect = document.getElementById("p-cate");
    if (catSelect) {
      catSelect.innerHTML = `<option value="">-- Chọn danh mục --</option>` +
        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    }

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--gray-500)">Không có sản phẩm</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => {
      const cat = categories.find(c => c.id == p.cate_id);
      return `
        <tr>
          <td style="font-family:monospace;font-size:0.82rem;color:var(--pink-600)">${p.id}</td>
          <td><img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'" style="width:52px;height:52px;object-fit:cover;border-radius:8px"></td>
          <td><strong style="color:var(--pink-800)">${p.name}</strong></td>
          <td style="color:var(--gray-500);font-size:0.85rem">${p.detail}</td>
          <td style="font-weight:700;color:var(--pink-600)">${formatVNDAdmin(p.price)}</td>
          <td>
            <span style="background:var(--pink-100);color:var(--pink-700);padding:3px 10px;border-radius:9999px;font-size:0.78rem;font-weight:700">
              ${cat ? cat.name : "?"}
            </span>
          </td>
          <td>
            <button class="action-btn edit" onclick="editProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}', '${p.detail.replace(/'/g, "\\'")}', ${p.price}, '${p.cate_id}', '${p.image}')">
              <i class="fas fa-edit"></i> Sửa
            </button>
            <button class="action-btn delete" onclick="deleteProduct('${p.id}')">
              <i class="fas fa-trash"></i> Xóa
            </button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:20px">Lỗi khi tải sản phẩm!</td></tr>`;
  }
}

function showAddProduct() {
  const formDiv = document.getElementById("form-add-product");
  formDiv.style.display = formDiv.style.display === "none" ? "block" : "none";
  editingId = null;
  document.getElementById("p-name").value = "";
  document.getElementById("p-detail").value = "";
  document.getElementById("p-price").value = "";
  document.getElementById("p-image").value = "";
  document.getElementById("p-cate").value = "";
  document.getElementById("form-product-title").textContent = "Thêm sản phẩm mới";
}

function editProduct(id, name, detail, price, cateId, image) {
  editingId = id;
  document.getElementById("form-add-product").style.display = "block";
  document.getElementById("p-name").value = name;
  document.getElementById("p-detail").value = detail;
  document.getElementById("p-price").value = price;
  document.getElementById("p-image").value = image;
  document.getElementById("p-cate").value = cateId;
  document.getElementById("form-product-title").textContent = "Chỉnh sửa sản phẩm";
  document.getElementById("form-add-product").scrollIntoView({ behavior: "smooth" });
}

async function saveProduct() {
  const name = document.getElementById("p-name").value.trim();
  const detail = document.getElementById("p-detail").value.trim();
  const price = parseInt(document.getElementById("p-price").value);
  const image = document.getElementById("p-image").value.trim();
  const cate_id = document.getElementById("p-cate").value;

  if (!name || !price || !cate_id) {
    showToastAdmin("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
    return;
  }

  const productData = { name, detail, price, image: image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop", cate_id: parseInt(cate_id) };

  try {
    if (editingId) {
      await fetch(`${API_PRODUCTS_ADMIN}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productData, id: editingId }),
      });
      showToastAdmin("Đã cập nhật sản phẩm!", "success");
    } else {
      await fetch(API_PRODUCTS_ADMIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      showToastAdmin("Đã thêm sản phẩm mới!", "success");
    }

    document.getElementById("form-add-product").style.display = "none";
    editingId = null;
    loadProducts();
  } catch (err) {
    showToastAdmin("Lỗi khi lưu sản phẩm!", "error");
  }
}

async function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  try {
    await fetch(`${API_PRODUCTS_ADMIN}/${id}`, { method: "DELETE" });
    showToastAdmin("Đã xóa sản phẩm!", "success");
    loadProducts();
  } catch (err) {
    showToastAdmin("Lỗi khi xóa!", "error");
  }
}

document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", loadProducts);
