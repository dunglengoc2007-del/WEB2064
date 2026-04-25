// ===== ACCOUNT PAGE =====
document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData) {
    showToast("Vui lòng đăng nhập trước!", "warning");
    setTimeout(() => window.location.href = "login.html", 1500);
    return;
  }

  // Update display name in header
  const nameDisplay = document.getElementById("user-display-name");
  if (nameDisplay) nameDisplay.textContent = userData.name;

  // Fill form
  document.getElementById("name").value = userData.name || "";
  document.getElementById("email").value = userData.email || "";
  document.getElementById("phone").value = userData.phone || "";
  document.getElementById("address").value = userData.address || "";

  // Update form
  document.getElementById("user-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedUser = {
      ...userData,
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
    };

    const btn = e.target.querySelector("#update-btn");
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang lưu...`;
    btn.disabled = true;

    try {
      const res = await fetch(`${API.users}/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        showToast("Cập nhật thông tin thành công!", "success");
        if (nameDisplay) nameDisplay.textContent = updatedUser.name;
      } else {
        showToast("Cập nhật thất bại! Thử lại sau.", "error");
      }
    } catch (err) {
      showToast("Không thể kết nối đến server!", "error");
    } finally {
      btn.innerHTML = `<i class="fas fa-save"></i> Lưu thay đổi`;
      btn.disabled = false;
    }
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      showToast("Đã đăng xuất thành công!", "info");
      setTimeout(() => window.location.href = "login.html", 1000);
    }
  });
});
