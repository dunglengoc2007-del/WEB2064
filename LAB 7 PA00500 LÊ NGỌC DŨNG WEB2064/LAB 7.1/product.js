//product.js

export class Product{
    constructor(id, name, price, quantity){
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    getTotal(){
        return this.price * this.quantity;
    }

    showInfor(){
        return `ID: ${this.id}, Tên: ${this.name}, Giá: ${this.price}, Số lượng: ${this.quantity}`;
    }
}