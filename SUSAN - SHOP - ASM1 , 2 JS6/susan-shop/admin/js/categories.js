// ===== ADMIN CATEGORIES =====
const API_CATEGORIES_MGT = "http://localhost:4000/categories";

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

const adminUser = JSON.parse(localStorage.getItem("user"));
if (!adminUser || adminUser.role !== "admin") {
  window.location.href = "login.html";
}

let editingId = null;

async function loadCategories() {
  const tbody = document.getElementById("category-list");
  tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px"><div class="spinner" style="margin:0 auto"></div></td></tr>`;

  try {
    const res = await fetch(API_CATEGORIES_MGT);
    const cats = await res.json();

    if (cats.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--gray-500)">Không có danh mục</td></tr>`;
      return;
    }

    tbody.innerHTML = cats.map(c => `
      <tr>
        <td style="font-family:monospace;font-size:0.82rem;color:var(--pink-600)">${c.id}</td>
        <td><strong style="color:var(--pink-800)">${c.name}</strong></td>
        <td style="color:var(--gray-500)">${c.parent_id || "—"}</td>
        <td>
          <button class="action-btn edit" onclick="editCategory('${c.id}', '${c.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button class="action-btn delete" onclick="deleteCategory('${c.id}')">
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#ef4444;padding:20px">Lỗi khi tải danh mục!</td></tr>`;
  }
}

function showAddForm() {
  const formDiv = document.getElementById("form-add");
  formDiv.style.display = formDiv.style.display === "none" ? "block" : "none";
  editingId = null;
  document.getElementById("cate-name").value = "";
  document.getElementById("form-cate-title").textContent = "Thêm danh mục mới";
}

function editCategory(id, name) {
  editingId = id;
  document.getElementById("form-add").style.display = "block";
  document.getElementById("cate-name").value = name;
  document.getElementById("form-cate-title").textContent = "Chỉnh sửa danh mục";
  document.getElementById("form-add").scrollIntoView({ behavior: "smooth" });
}

async function saveCategory() {
  const name = document.getElementById("cate-name").value.trim();
  if (!name) {
    showToastAdmin("Vui lòng nhập tên danh mục!", "error");
    return;
  }

  try {
    if (editingId) {
      await fetch(`${API_CATEGORIES_MGT}/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      showToastAdmin("Đã cập nhật danh mục!", "success");
    } else {
      await fetch(API_CATEGORIES_MGT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parent_id: null }),
      });
      showToastAdmin("Đã thêm danh mục mới!", "success");
    }

    document.getElementById("form-add").style.display = "none";
    editingId = null;
    loadCategories();
  } catch (err) {
    showToastAdmin("Lỗi khi lưu danh mục!", "error");
  }
}

async function deleteCategory(id) {
  if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
  try {
    await fetch(`${API_CATEGORIES_MGT}/${id}`, { method: "DELETE" });
    showToastAdmin("Đã xóa danh mục!", "success");
    loadCategories();
  } catch (err) {
    showToastAdmin("Lỗi khi xóa!", "error");
  }
}

document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", loadCategories);
