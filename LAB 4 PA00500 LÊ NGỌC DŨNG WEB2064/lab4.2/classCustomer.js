//tạo class customer
class Customer{
    constructor(name, email, phone){
        this.name = name;
        this._email = email;
        this.phone = phone;
    }

    //getter hiển thị thông tin khách hàng
    get info(){
        return `Tên: ${this.name}, Email: ${this._email}, SĐT: ${this.phone}`;
    }

    //setter kiểm tra định dạng email trước khi set
    set email(newEmail){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailRegex.test(newEmail)){
            this._email = newEmail;
        }
        else{
            console.log("Email không hợp lệ !");
        }
    }

    get email(){
        return this._email;
    }
}

// Test
let c1 = new Customer("Nguyễn Văn A", "a@example.com", "0901234567");
console.log(c1.info);

c1.email = "abc@gmail.com"; // cập nhật hợp lệ
console.log(c1.info);

c1.email = "saiemail"; // báo lỗi
console.log(c1.info);
