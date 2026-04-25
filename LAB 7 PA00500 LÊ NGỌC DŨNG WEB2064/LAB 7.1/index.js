//xuất ra hàm cộng 2 số
import {add, PI} from "./math.js";

console.log("Kết quả add(6,3) là : ",add(6,3));
console.log("Giá trị PI: ",PI);


//xuất ra sản phẩm
import { Product } from "./product.js";

console.log("-------------Xuất ra danh sách sản phẩm------------");

//khai báo 1 mảng sản phẩm
const products = [
    new Product(1, "Trà sữa", 20000, 10),
    new Product(2, "Cà phê", 30000, 10),
    new Product(3, "Nước lọc", 10000, 10),
    new Product(1, "Nước ngọt", 40000, 10),
];

//hiển thị sản phẩm
products.forEach(p =>console.log(p.showInfor() + ", Tổng cộng: "+ p.getTotal()));
