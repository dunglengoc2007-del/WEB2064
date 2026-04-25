// class product
class Product{
    constructor(id, name, price){
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

//class product manager
class ProductManager{
    constructor(){
        this.products = [];
    }

    //thêm sản phẩm
    addProduct(product){
        this.products.push(product);
    }

    //tìm sản phẩm theo tên (static)
    static findByName(products,name){
        return products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    }
}

//test
let manager = new ProductManager();

let sp1 = new Product(1, "Cà phê", 20000);
let sp2 = new Product(2, "Trà sữa", 30000);
let sp3 = new Product(3, "Nước cam", 25000);

manager.addProduct(sp1);
manager.addProduct(sp2);
manager.addProduct(sp3);

console.log(manager.products);

//tìm kiếm
let result = ProductManager.findByName(manager.products, "Trà");
console.log(result);