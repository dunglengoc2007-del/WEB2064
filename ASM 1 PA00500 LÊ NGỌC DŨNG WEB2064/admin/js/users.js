const API_URL = "http://localhost:4000/users";

const idInput = document.getElementById("user-id");
const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email")
const passwordInput = document.getElementById("user-password");
const phoneInput = document.getElementById("user-phone");
const addressInput = document.getElementById("user-address");
const roleInput = document.getElementById("user-role");

// tải danh sách người dùng
async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}`);
        if (!res.ok) throw new Error("Không thể tải danh sách người dùng");
        const users = await res.json();

        const tbody = document.getElementById("user-list");
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.phone || ""}</td>
                <td>${user.address || ""}</td>
                <td>
                    <button class="btn-edit" onclick="editUser('${user.id}')">Sửa</button>
                    <button class="btn-delete" onclick="deleteUser('${user.id}')">Xóa</button>
                </td>
            </tr>
        `).join("");
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

// thêm hoặc cập nhật người dùng
document.getElementById("user-form").addEventListener("submit", async function(e){
    e.preventDefault();

    const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        role: roleInput.value.trim()
    };

    const id = idInput.value.trim();

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id, ...userData})
        });
        alert("Cập nhật thành công!");
    } else {
        await fetch(`${API_URL}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        });
        alert("Thêm mới thành công!");
    }

    resetForm();
    loadUsers();
});

// sửa người dùng
async function editUser(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const user = await res.json();

    idInput.value = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
    passwordInput.value = user.password;
    phoneInput.value = user.phone;
    addressInput.value = user.address;
    roleInput.value = user.role;
}

// xóa người dùng
async function deleteUser(id) {
    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadUsers();
    }
}

// reset form
function resetForm() {
    document.getElementById("user-form").reset();
}

document.getElementById("reset-form").addEventListener("click", resetForm);

// khởi tạo
loadUsers();