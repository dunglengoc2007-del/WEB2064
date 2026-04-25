const API_URL = "http://localhost:4001/products";

async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Không tải được sản phẩm!");

        const products = await res.json();
        const container = document.getElementById("product-list");

        if (products.length === 0) {
            container.innerHTML = "<p>Không có sản phẩm</p>";
            return;
        }

        container.innerHTML = products.map(p => `
            <div class="product">
                <img src="${p.image}" alt="${p.name}" 
                     onerror="this.src='https://via.placeholder.com/150'">
                <h3>${p.name}</h3>
                <p>Giá: ${Number(p.price).toLocaleString()}₫</p>
            </div>
        `).join("");

    } catch (err) {
        document.getElementById("product-list").innerHTML =
            "<p style='color:red'>Lỗi tải dữ liệu!</p>";
        console.error(err);
    }
}

loadProducts();