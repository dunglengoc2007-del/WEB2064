const API_URL = "http://localhost:4000"; // đường dẫn json-server

//json-server --watch db.json --port 4000
//hàm hiển thị thông tin trên trang chủ
async function loadDashBoard() {
    try{
        //lấy dữ liệu từ jb.json
        const [categoriesRes, productsRes, usersRes, ordersRes, product_variantsRes] = await Promise.all([
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/users`),
            fetch(`${API_URL}/orders`),
            fetch(`${API_URL}/product_variants`)
        ]);

        //chuyển về dữ liệu js
        const [categories, products, users, orders, product_variants] = await Promise.all([
            categoriesRes.json(),
            productsRes.json(),
            usersRes.json(),
            ordersRes.json(),
            product_variantsRes.json()
        ]);

        // cập nhật thống kê
        document.getElementById("total-categories").textContent = categories.length;
        document.getElementById("total-products").textContent = products.length;
        document.getElementById("total-users").textContent = users.length;
        document.getElementById("total-orders").textContent = orders.length;

        // Tính tổng doanh thu
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        document.getElementById("total-revenue").textContent = totalRevenue.toLocaleString("vi-VN") + " ₫";

        // Sản phẩm sắp hết hàng (dựa vào variant.quantity)
        const lowStock = product_variants.filter(v => v.quantity <= 10);
        const lowStockList = document.getElementById("low-stock-list");
        if (lowStock.length === 0) {
            lowStockList.innerHTML = "<li>Không có sản phẩm sắp hết hàng</li>";
        } else {
            lowStockList.innerHTML = lowStock
                .map(v => {
                    const prod = products.find(p => p.id == v.product_id);
                    return `<li>${prod ? prod.name : "Không xác định"} (${v.variant_name}) - Còn ${v.quantity}</li>`;
                })
                .join("");
        }

        // Biểu đồ danh mục theo số lượng sản phẩm
        const categoryCounts = categories.map(cat =>{
            const count = products.filter(p => p.cate_id == cat.id).length;
            return {name: cat.name , count};
        });

        // hiển thị đơn hàng gần đây
        const orderList = document.getElementById("order-list");
        orderList.innerHTML = orders
        .slice(-5) // lấy 5 đơn mới nhất
        .reverse()
        .map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.user?.name || "Ẩn danh"}</td>
                <td>${order.total.toLocaleString()} đ</td>
                <td>${new Date(order.create_at).toLocaleDateString("vi-VN")}</td>
                <td>${order.status}</td>
            </tr>
        `)
        .join("");

        renderCategoryChart(categoryCounts);
    }
    catch(err){
        console.error("Lỗi khi tải dữ liệu !", err);
    }
}


//hàm đăng xuất tài khoản admin
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("admin");
    alert("Đăng xuất thành công!");
    window.location.href = "login.html";
});

//hàm hiển thị biểu đồ

function renderCategoryChart(data) {
    const ctx = document.getElementById("categoryChart");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: "Số lượng sản phẩm",
                data: data.map(d => d.count),
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

loadDashBoard();