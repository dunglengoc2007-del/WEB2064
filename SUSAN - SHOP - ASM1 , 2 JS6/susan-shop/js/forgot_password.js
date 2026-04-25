// ===== FORGOT PASSWORD PAGE =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("forgot-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const btn = e.target.querySelector("button[type=submit]");

    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang kiểm tra...`;
    btn.disabled = true;

    try {
      const res = await fetch(`${API.users}?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        showToast("Không tìm thấy tài khoản với email này!", "error");
        btn.innerHTML = `<i class="fas fa-key"></i> Xác nhận`;
        btn.disabled = false;
        return;
      }

      const user = users[0];
      const newPass = prompt(`Nhập mật khẩu mới cho tài khoản ${user.email}:`);
      if (!newPass) {
        btn.innerHTML = `<i class="fas fa-key"></i> Xác nhận`;
        btn.disabled = false;
        return;
      }

      await fetch(`${API.users}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPass }),
      });

      showToast("Mật khẩu đã được cập nhật thành công!", "success");
      setTimeout(() => window.location.href = "login.html", 1500);
    } catch (err) {
      showToast("Không thể kết nối đến server!", "error");
      btn.innerHTML = `<i class="fas fa-key"></i> Xác nhận`;
      btn.disabled = false;
    }
  });
});
