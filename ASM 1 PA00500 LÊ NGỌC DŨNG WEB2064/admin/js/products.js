const API_URL = "http://localhost:4000/products";
const CATE_API = "http://localhost:4000/categories";

const idInput = document.getElementById("product-id");
const nameInput = document.getElementById("product-name");
const priceInput = document.getElementById("product-price");
const cateInput = document.getElementById("product-cate");
const detailInput = document.getElementById("product-detail");
const imageFileInput = document.getElementById("product-image-file");
const imageHiddenInput = document.getElementById("product-image-hidden");
const currentImageText = document.getElementById("current-image-name");

async function loadInit() {
    try {
        const cRes = await fetch(CATE_API);
        const categories = await cRes.json();
        cateInput.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        
        loadProducts(categories);
    } catch (err) {
        console.error(err);
    }
}

async function loadProducts(categories) {
    try {
        let cats = categories;
        if(!cats) {
            const cRes = await fetch(CATE_API);
            cats = await cRes.json();
            cateInput.innerHTML = cats.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        }
        
        const res = await fetch(API_URL);
        const products = await res.json();

        const tbody = document.getElementById("product-list");
        tbody.innerHTML = products.map(product => {
            const cateName = cats.find(c => c.id == product.cate_id)?.name || "N/A";
            return `
            <tr>
                <td>${product.id}</td>
                <td><img src="../images/${product.image}" width="50" height="50" style="object-fit:cover;border-radius:5px;"></td>
                <td>${product.name}</td>
                <td>${Number(product.price).toLocaleString("vi-VN")} đ</td>
                <td>${cateName}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct('${product.id}')">Sửa</button>
                    <button class="btn-delete" onclick="deleteProduct('${product.id}')">Xóa</button>
                </td>
            </tr>
        `}).join("");
    } catch (err) {
        console.error(err);
    }
}

document.getElementById("product-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const rawPrice = priceInput.value;
    // Xóa tất cả các ký tự không phải số (như đ, d, dấu chấm, phẩy...)
    const parsedPrice = Number(rawPrice.replace(/[^0-9]/g, ''));

    // Xác định tên file hình ảnh sẽ lưu vào DB
    let imageToSave = imageHiddenInput.value;
    if (imageFileInput.files.length > 0) {
        imageToSave = imageFileInput.files[0].name;
    }

    if (!imageToSave) {
        alert("Vui lòng chọn hình ảnh!");
        return;
    }

    const productData = {
        name: nameInput.value.trim(),
        price: parsedPrice,
        cate_id: Number(cateInput.value),
        detail: detailInput.value.trim(),
        image: imageToSave
    };

    const id = idInput.value.trim();

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id, ...productData})
        });
        alert("Cập nhật thành công!");
    } else {
        await fetch(`${API_URL}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(productData)
        });
        alert("Thêm mới thành công!");
    }

    resetForm();
    loadProducts();
});

async function editProduct(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();
    idInput.value = p.id;
    nameInput.value = p.name;
    priceInput.value = p.price;
    cateInput.value = p.cate_id;
    detailInput.value = p.detail;
    
    // Xử lý hiển thị ảnh cũ
    imageHiddenInput.value = p.image;
    currentImageText.textContent = "Ảnh hiện tại đang lưu: " + p.image;
    imageFileInput.value = ""; // Xoá file picker
}

async function deleteProduct(id) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadProducts();
    }
}

function resetForm() {
    document.getElementById("product-form").reset();
    idInput.value = "";
    imageHiddenInput.value = "";
    currentImageText.textContent = "";
}

document.getElementById("reset-form").addEventListener("click", resetForm);

loadInit();
