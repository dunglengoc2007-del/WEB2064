// ===== ADMIN LOGIN =====
const API_USERS_ADMIN = "http://localhost:4000/users";

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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const btn = e.target.querySelector("button[type=submit]");

    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...`;
    btn.disabled = true;

    try {
      const res = await fetch(`${API_USERS_ADMIN}?email=${email}&password=${password}`);
      const users = await res.json();

      if (users.length === 0 || users[0].role !== "admin") {
        showToastAdmin("Sai thông tin hoặc không có quyền admin!", "error");
        btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Đăng nhập`;
        btn.disabled = false;
        return;
      }

      localStorage.setItem("user", JSON.stringify(users[0]));
      showToastAdmin("Đăng nhập admin thành công!", "success");
      setTimeout(() => window.location.href = "index.html", 1000);
    } catch (err) {
      showToastAdmin("Không thể kết nối đến server!", "error");
      btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Đăng nhập`;
      btn.disabled = false;
    }
  });
});
