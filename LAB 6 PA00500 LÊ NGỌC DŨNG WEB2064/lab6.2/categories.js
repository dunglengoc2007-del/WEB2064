// json-server --watch db.json --port 4001
const API_URL = "http://localhost:4001/categories";

const form = document.getElementById("category-form");
const tbody = document.getElementById("category-list");

const idInput = document.getElementById("id");
const nameInput = document.getElementById("name");
const slugInput = document.getElementById("slug");
const parentInput = document.getElementById("parentCategory");
const imageInput = document.getElementById("image");

// Load danh mục
async function loadCategories() {
    const res = await fetch(API_URL);
    const data = await res.json();

    tbody.innerHTML = data.map(cat => `
        <tr>
            <td>${cat.id}</td>
            <td><img src="${cat.image}" width="60" height="60" style="object-fit:cover;border-radius:6px"></td>
            <td>${cat.name}</td>
            <td>${cat.slug}</td>
            <td>${cat.parentCategory}</td>
            <td>
            <button onclick="editCategory('${cat.id}')">✏️ Sửa</button>
            <button onclick="deleteCategory('${cat.id}')">🗑️ Xóa</button>
            </td>
        </tr>
    `).join("");
}

// Thêm hoặc cập nhật danh mục
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = {
        name: nameInput.value.trim(),
        slug: slugInput.value.trim(),
        parentCategory: parentInput.value.trim(),
        image: imageInput.value.trim()
    };

    const id = idInput.value.trim();

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...category })
        });
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category)
        });
    }

    form.reset();
    await loadCategories();
});

//hàm sửa sản phẩm
async function editCategory(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();

    idInput.value = data.id;
    nameInput.value = data.name;
    slugInput.value = data.slug;
    parentInput.value = data.parentCategory;
    imageInput.value = data.image;

    nameInput.focus();
}

//hàm xoá sản phẩm
async function deleteCategory(id) {
    if (confirm("Bạn có chắc chắn muốn xoá danh mục này?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        await loadCategories();
    }
}

loadCategories();