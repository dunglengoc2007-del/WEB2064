//tạo đường dẫn đến file json server
const API_URL = "http://localhost:4000";

//lấy dữ liệu giỏ hàng từ local
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//hiển thị giỏ hàng trên checkout
function loadCheckout(){
    let tbody = document.getElementById("checkout-items");
    let total = 0;
    tbody.innerHTML = "";

    //lặp để hiển thị giỏ hàng
    for(let item of cart){
        let subtotal = item.price * item.quantity;
        total += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td><img src="../images/${item.image}" alt="${item.name}" width="50" height="50"></td>
                <td>${item.price} VND</td>
                <td>${item.quantity}</td>
                <td>${subtotal} VND</td>
            </tr>
        `;
    }

    //hiẻn thị tổng tiền
    document.getElementById("checkout-total").innerText = total;

    //trả về tổng tiền để dùng sau
    return total;
}

//xử lý submit form đặt hàng
document.getElementById("checkout-form").addEventListener("submit", async(e)=>{
    //ngăn form gửi mặc định
    e.preventDefault();

    //lấy thông tin khách hàng từ form
    const user = {
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        phone : document.getElementById("phone").value,
        address : document.getElementById("address").value
    };

    //tính tổng tiền
    const total = loadCheckout();

    //tạo đơn hàng
    const order = {
        user,
        total,
        items: cart,
        create_at: new Date().toISOString(),
        status: "pending"
    };

    //xử lý đặt hàng
    try{
        //gửi dữ liệu order đến json server
        let res = await fetch(`${API_URL}/orders`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(order)
        });

        if(!res.ok) throw new Error("Không lưu được đơn hàng !");

        //xoá giỏ hàng sau khi đặt hàng
        localStorage.removeItem("cart");

        window.location.href = "thankyou.html";

        alert("Đặt hàng thành công !");
    }
    catch(err){
        console.log(err);
        alert("Lỗi khi đặt hàng !");
    }
});

//hiển thị giỏ hàng khi mở trang
loadCheckout();