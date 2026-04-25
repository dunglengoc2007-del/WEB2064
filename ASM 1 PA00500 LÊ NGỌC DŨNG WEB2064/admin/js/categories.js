const API_URL = "http://localhost:4000/categories";

const idInput = document.getElementById("cate-id");
const nameInput = document.getElementById("cate-name");

async function loadCategories() {
    try {
        const res = await fetch(`${API_URL}`);
        if (!res.ok) throw new Error("Không thể tải danh sách");
        const categories = await res.json();

        const tbody = document.getElementById("category-list");
        tbody.innerHTML = categories.map(cate => `
            <tr>
                <td>${cate.id}</td>
                <td>${cate.name}</td>
                <td>
                    <button class="btn-edit" onclick="editCategory('${cate.id}')">Sửa</button>
                    <button class="btn-delete" onclick="deleteCategory('${cate.id}')">Xóa</button>
                </td>
            </tr>
        `).join("");
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

document.getElementById("cate-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const cateData = {
        name: nameInput.value.trim()
    };

    const id = idInput.value.trim();

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id, ...cateData})
        });
        alert("Cập nhật thành công!");
    } else {
        await fetch(`${API_URL}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(cateData)
        });
        alert("Thêm mới thành công!");
    }

    resetForm();
    loadCategories();
});

async function editCategory(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const cate = await res.json();
    idInput.value = cate.id;
    nameInput.value = cate.name;
}

async function deleteCategory(id) {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadCategories();
    }
}

function resetForm() {
    document.getElementById("cate-form").reset();
    idInput.value = "";
}

document.getElementById("reset-form").addEventListener("click", resetForm);

loadCategories();
