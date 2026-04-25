onst API_ORDERS = "http://localhost:4000/orders";

//hàm hiển thị sản phẩm
async function loadOrders() {
    try {
        const res = await fetch(API_ORDERS);
        const orders = await res.json();

        const list = document.getElementById("order-list");

        if (orders.length === 0) {
            list.innerHTML = `<p>Chưa có đơn hàng nào.</p>`;
            return;
        }

        list.innerHTML = `
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${new Date(order.create_at).toLocaleString("vi-VN")}</td>
                            <td>
                                ${order.user?.name || "Không rõ"}<br>
                                <small>${order.user?.phone || ""}</small>
                            </td>
                            <td>${order.total.toLocaleString("vi-VN")}đ</td>
                            <td>
                                <select onchange="updateStatus('${order.id}', this.value)">
                                    <option value="pending" ${order.status === "pending" ? "selected" : ""}>Chờ xử lý</option>
                                    <option value="shipping" ${order.status === "shipping" ? "selected" : ""}>Đang giao</option>
                                    <option value="completed" ${order.status === "completed" ? "selected" : ""}>Hoàn thành</option>
                                    <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Đã hủy</option>
                                </select>
                            </td>
                            <td>
                                <button onclick="viewDetails('${order.id}')">Chi tiết</button>
                                <button onclick="deleteOrder('${order.id}')">Xóa</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

    } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
    }
}

//cập nhật trạng thái giao hàng
async function updateStatus(id, newStatus) {
    try {
        await fetch(`${API_ORDERS}/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status: newStatus})
        });
        alert("Cập nhật trạng thái thành công!");
    } catch (err) {
        alert("Lỗi khi cập nhật trạng thái!");
        console.error(err);
    }
}

//hiển thị trang chi tiết đơn hàng
function viewDetails(id) {
    window.location.href = `order_detail.html?id=${id}`;
}

//xoá đơn hàng có trong trang
async function deleteOrder(id) {
    if (!confirm("Xóa đơn hàng này?")) return;
    await fetch(`${API_ORDERS}/${id}`, { method: "DELETE" });
    alert("Đã xóa đơn hàng!");
    loadOrders();
}

loadOrders();