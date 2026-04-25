// ===== LOGIN PAGE =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const btn = e.target.querySelector("button[type=submit]");

    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...`;
    btn.disabled = true;

    try {
      const res = await fetch(`${API.users}?email=${email}&password=${password}`);
      const users = await res.json();

      if (users.length === 0) {
        showToast("Sai email hoặc mật khẩu!", "error");
        btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Đăng nhập`;
        btn.disabled = false;
        return;
      }

      const user = users[0];
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        showToast("Chào mừng Admin " + user.name + "!", "success");
        setTimeout(() => window.location.href = "../admin/index.html", 1000);
      } else {
        showToast("Đăng nhập thành công! Chào " + user.name, "success");
        setTimeout(() => window.location.href = "index.html", 1000);
      }
    } catch (err) {
      showToast("Không thể kết nối đến server!", "error");
      btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Đăng nhập`;
      btn.disabled = false;
    }
  });
});
