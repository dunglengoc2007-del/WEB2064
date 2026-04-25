// ===== REGISTER PAGE =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const btn = e.target.querySelector("button[type=submit]");

    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang đăng ký...`;
    btn.disabled = true;

    try {
      // Check if email exists
      const checkRes = await fetch(`${API.users}?email=${email}`);
      const existing = await checkRes.json();

      if (existing.length > 0) {
        showToast("Email này đã được đăng ký!", "error");
        btn.innerHTML = `<i class="fas fa-user-plus"></i> Đăng ký`;
        btn.disabled = false;
        return;
      }

      // Register new user
      await fetch(API.users, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, address, role: "user" }),
      });

      showToast("Đăng ký thành công! Đang chuyển đến đăng nhập...", "success");
      setTimeout(() => window.location.href = "login.html", 1500);
    } catch (err) {
      showToast("Không thể kết nối đến server!", "error");
      btn.innerHTML = `<i class="fas fa-user-plus"></i> Đăng ký`;
      btn.disabled = false;
    }
  });
});
