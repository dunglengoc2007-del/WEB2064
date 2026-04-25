// Bài 1: tạo ra lớp product
class Product {
    constructor(id, name, price, stock){
        this.id = id,
        this.name = name,
        this.price = price,
        this.stock = stock
    }

    //hàm lấy ra thông tin
    getInfor(){
        return `Sản phẩm: ${this.name}, Giá: ${this.price}đ, Tồn kho: ${this.stock}`;
    }
}

// class kế thừa class product để in ra địa chỉ sản phẩm số
class DigitalProduct extends Product{
    constructor(id, name, price, downLoadLink){
        //gọi lớp cha
        super(id, name, price, null);
        this.downLoadLink = downLoadLink;
    }

    //ghi đè phương thức cha
    getInfor(){
        return `Sản phẩm số: ${this.name}, Giá: ${this.price}đ, Link tải: ${this.downLoadLink}`;
    }
}

// 🧪 Thử tạo object
const ebook = new DigitalProduct(101, "E-book JavaScript", 120000, "https://download.com/ebook-js");
console.log(ebook.getInfor());

//Bài 2: class khách hàng
class Customer{
    constructor(name, email, phone){
        this.name = name,
        this.email = email,
        this.phone = phone
    }

    //hàm lấy ra thông tin
    getInfor(){
        return `Khách hàng: ${this.name}, Email: ${this.email}, SĐT: ${this.phone}`;
    }
}

// Kế thừa từ class khách hàng
class AdminUser extends Customer{
    constructor(name, email, phone){
        //gọi ở lớp cha
        super(name, email, phone);
        this.role = "admin";
    }

    //thêm phương thức khoá người dùng
    banUser(user){
        console.log(`Người dùng ${user.name} đã bị khoá bởi admin ${this.name}`);
    }
}

//thử tạo object
const user1 = new Customer("Nguyễn Văn A", "a@gmail.com", "0123456789");
const admin = new AdminUser("Quản trị viên B", "admin@gmail.com", "0987654321");

//hiển thị thông tin admin và thực hiện khoá user
console.log(admin.getInfor());
admin.banUser(user1);

