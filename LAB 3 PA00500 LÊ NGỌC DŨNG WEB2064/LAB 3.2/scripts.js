//khai báo mảng giỏ hàng
let cart = [];

//hàm thêm sản phẩm vào giỏ hàng
function addToCart(name, price){
    //kiểm tra sản phẩm đã có trong giỏ hàng chưa
    let item = cart.find(p => p.name === name);
    if(item){
        //nếu có rồi thì tăng số lượng
        item.quantity++;
    }
    else{
        //nếu chưa có thì thêm sản phẩm mới vào giỏ hàng
        cart.push({
            name: name, 
            price: price, 
            quantity: 1
        });
    }

    //cập nhật giỏ hàng lên giao diện
    renderCart();
}

//hàm xoá sản phẩm khỏi giỏ hàng
function removeFromCart(name){
    //nếu sản phẩm có trong giỏ hàng thì xoá ngược lại thì không làm gì
    cart = cart.filter(p => p.name !== name);
    renderCart();
}

//hàm tính tổng tiền giỏ hàng
function getTotal(){
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

//hàm hiển thị giỏ hàng lên giao diện
function renderCart(){
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if(cart.length === 0){
        cartItems.innerHTML = '<tr><td colspan="4">Giỏ hàng trống</td></tr>';
    }
    else{
        cart.forEach(item =>{
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart('${item.name}')">X</button>
            `;
            cartItems.appendChild(div);
        });
    }

    document.getElementById("total").textContent = "Total: $" + getTotal().toFixed(2);
}

// Thanh toán
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
    return;
    }
    alert("Thanh toán tổng: $" + getTotal().toFixed(2));
    cart = []; // reset giỏ
    renderCart();
}
