// Tạo class Product
class Product {
    constructor(id, name, price, quantity) {
        this.id = id;// mã sản phẩm
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    getInfo() {
        return `ID: ${this.id}, Sản phẩm: ${this.name}, Giá: ${this.price} VND, Số lượng: ${this.quantity}`;
    }

    buy(amount) {
        if (amount <= this.quantity) {
            this.quantity -= amount;
            console.log(`Mua thành công ${amount} ${this.name}. Còn lại: ${this.quantity}`);
        } else {
            console.log(`Không đủ hàng! Chỉ còn ${this.quantity} sản phẩm.`);
        }
    }
}

// Tạo class Cart
class Cart {
    constructor(){
        this.items = [];
    }

    addItem(product, quantity){
        this.items.push({ product, quantity });
        console.log(`Đã thêm ${quantity} ${product.name} vào giỏ hàng.`);
    }

    getTotal(){
        return this.items.reduce((total, item) => 
            total + item.product.price * item.quantity, 0);
    }

    showCart(){
        console.log("Giỏ hàng:");
        if (this.items.length === 0) {
            console.log("Giỏ hàng trống!");
        } else {
            this.items.forEach(item => {
                console.log(`[${item.product.id}] ${item.product.name} - ${item.quantity} x ${item.product.price} = ${item.product.price * item.quantity} VND`);
            });
            console.log(`Tổng tiền: ${this.getTotal()} VND`);
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng theo ID
    removeItem(productId) {
        const oldLength = this.items.length;

        // giữ lại những sản phẩm KHÔNG có id trùng
        this.items = this.items.filter(item => item.product.id !== productId);

        if (this.items.length < oldLength) {
            console.log(`Đã xóa sản phẩm có ID = ${productId} khỏi giỏ hàng.`);
        } else {
            console.log(`Không tìm thấy sản phẩm với ID = ${productId} trong giỏ hàng.`);
        }
    }
}

// Test
let sp1 = new Product(101, "Iphone 13", 20000000, 5);
let sp2 = new Product(102, "Iphone 14", 25000000, 3);

let cart = new Cart();
cart.addItem(sp1, 2);
cart.addItem(sp2, 1);
cart.showCart();

cart.removeItem(101); // xóa Iphone 13
cart.showCart();

cart.removeItem(102); // xóa Iphone 14
cart.showCart();