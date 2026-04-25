//lấy 2 class từ 2 file
import { Product } from "./product.js";
import { User } from "./user.js";

//lấy các hàm từ crud
import { addItem, updateItem, deleteItem, showList } from "./crud.js";

console.log("----Quản lý sản phẩm----");
let products = [
    new Product(1, "Cà phê sữa", 20000, 2),
    new Product(2, "Trà sữa", 30000, 5),
];

showList(products);

//thêm sản phẩm
addItem(products, new Product(3, "Bánh tráng trộn", 10000, 3));

//cập nhật sản phẩm
updateItem(products, 2, {price: 50000});

//xoá sản phẩm
deleteItem(products, 1);

//hiển thị nội dung sau khi cập nhật , thêm và xoá
console.log("Danh sách sản phẩm sau khi thêm sửa và xoá là:")
showList(products);



//Quản lý và hiển thị người dùng
console.log("\n----Quản lý người dùng----");
let users = [
    new User(1, "Nguyễn Đình Tú", "dinhtu20091998@gmail.com", "user"),
    new User(2, "Nguyễn Thị Thu Thảo", "thuthao1998@gmail.com", "user"),
];
//hiển thị thông tin ban đầu của người dùng
showList(users);

//thêm người dùng mới
addItem(users, new User(3, "Trần Thị Tuyết Nhung", "tuyetnhung2001@gmail.com", "user"));

//cập nhật thông tin người dùng
updateItem(users, 2, {role : "admin"});

//xoá người dùng thứ 1
deleteItem(users, 1);

//hiển thị lại thông tin sau khi cập nhật
console.log("Danh sách người dùng sau khi cập nhật, thêm và xoá: ");
showList(users);