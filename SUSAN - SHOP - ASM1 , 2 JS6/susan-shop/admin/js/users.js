// ===== ADMIN USERS =====
const API_USERS_MGT = "http://localhost:4000/users";

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

async function loadUsers() {
  const tbody = document.getElementById("user-list");
  tbody.innerHTML = `<tr><td colspan="7" class="loading" style="text-align:center;padding:30px"><div class="spinner" style="margin:0 auto"></div></td></tr>`;
  try {
    const res = await fetch(API_USERS_MGT);
    const users = await res.json();

    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--gray-500)">Không có người dùng</td></tr>`;
      return;
    }

    tbody.innerHTML = users.map(u => `
      <tr id="row-${u.id}">
        <td style="font-family:monospace;font-size:0.82rem;color:var(--pink-600)">${u.id}</td>
        <td><strong style="color:var(--pink-800)">${u.name}</strong></td>
        <td style="color:var(--gray-500)">${u.email}</td>
        <td>${u.phone || "—"}</td>
        <td style="font-size:0.82rem;color:var(--gray-500)">${u.address || "—"}</td>
        <td>
          <span style="background:${u.role === 'admin' ? 'linear-gradient(135deg,var(--pink-500),var(--pink-600))' : 'var(--pink-100)'};
                       color:${u.role === 'admin' ? 'white' : 'var(--pink-700)'};
                       padding:3px 12px;border-radius:9999px;font-size:0.78rem;font-weight:700">
            ${u.role === "admin" ? "Admin" : "User"}
          </span>
        </td>
        <td>
          <button class="action-btn edit" onclick="editUser('${u.id}', '${u.name.replace(/'/g, "\\'")}', '${u.email}', '${u.phone || ""}', '${(u.address || "").replace(/'/g, "\\'")}', '${u.role}')">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button class="action-btn delete" onclick="deleteUser('${u.id}')">
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:20px">Lỗi khi tải danh sách!</td></tr>`;
  }
}

function showAddForm() {
  const formDiv = document.getElementById("form-add-user");
  formDiv.style.display = formDiv.style.display === "none" ? "block" : "none";
  editingId = null;
  document.getElementById("user-id").value = "";
  document.getElementById("user-name").value = "";
  document.getElementById("user-email").value = "";
  document.getElementById("user-password").value = "";
  document.getElementById("user-phone").value = "";
  document.getElementById("user-address").value = "";
  document.getElementById("user-role").value = "user";
  document.getElementById("form-title").textContent = "Thêm người dùng mới";
}

function editUser(id, name, email, phone, address, role) {
  editingId = id;
  document.getElementById("form-add-user").style.display = "block";
  document.getElementById("user-id").value = id;
  document.getElementById("user-name").value = name;
  document.getElementById("user-email").value = email;
  document.getElementById("user-phone").value = phone;
  document.getElementById("user-address").value = address;
  document.getElementById("user-role").value = role;
  document.getElementById("form-title").textContent = "Chỉnh sửa người dùng";
  document.getElementById("form-add-user").scrollIntoView({ behavior: "smooth" });
}

async function saveUser() {
  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const password = document.getElementById("user-password").value.trim();
  const phone = document.getElementById("user-phone").value.trim();
  const address = document.getElementById("user-address").value.trim();
  const role = document.getElementById("user-role").value;

  if (!name || !email) {
    showToastAdmin("Vui lòng nhập đầy đủ thông tin!", "error");
    return;
  }

  const userData = { name, email, phone, address, role };
  if (password) userData.password = password;

  try {
    if (editingId) {
      await fetch(`${API_USERS_MGT}/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      showToastAdmin("Đã cập nhật người dùng!", "success");
    } else {
      const check = await fetch(`${API_USERS_MGT}?email=${email}`);
      const existing = await check.json();
      if (existing.length > 0) {
        showToastAdmin("Email này đã tồn tại!", "error");
        return;
      }
      await fetch(API_USERS_MGT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, password: password || "123456" }),
      });
      showToastAdmin("Đã thêm người dùng mới!", "success");
    }

    document.getElementById("form-add-user").style.display = "none";
    editingId = null;
    loadUsers();
  } catch (err) {
    showToastAdmin("Lỗi khi lưu người dùng!", "error");
  }
}

async function deleteUser(id) {
  if (id == adminUser.id) {
    showToastAdmin("Không thể xóa tài khoản đang đăng nhập!", "error");
    return;
  }
  if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
  try {
    await fetch(`${API_USERS_MGT}/${id}`, { method: "DELETE" });
    showToastAdmin("Đã xóa người dùng!", "success");
    loadUsers();
  } catch (err) {
    showToastAdmin("Lỗi khi xóa!", "error");
  }
}

document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", loadUsers);
