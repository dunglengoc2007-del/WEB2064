//Bài 1: tạo class client
class Client{
    //khai báo thuộc tính private đầu class
    #name;

    constructor(name, email, phone){
        this.#name = name;
        this._email = email; //tạo khác biệt
        this.phone = phone;
    }

    //phương thức lấy thông tin người dùng
    getContactInfor(){
        return `Tên : ${this.#name}, Email: ${this._email}, Phone: ${this.phone}`;
    }

    //phương thức kiểm tra tính hợp lệ của email
    isEmailValid(){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this._email);
    }

    // thêm get để đọc name từ bên ngoài class
    get name(){
        return this.#name;
    }
}

// 🧪 Kiểm tra
const client1 = new Client("Nguyễn Văn A", "vana@example.com", "0123456789");

console.log(client1.getContactInfor());
console.log("Email hợp lệ:", client1.isEmailValid());


//Bài 2: Tạo PremiumClient kế thừa từ Client
class PremiumClient extends Client{
    constructor(name, email, phone, membershipLever = "Basic"){
        //gọi constructor lớp cha
        super(name, email, phone);

        //dùng Object defineProperty để tạo thuộc tính không thể thay đổi được
        Object.defineProperty(this, "membershipLever", {
            value : membershipLever,
            writable : false, //không được ghi đè
            enumerable: true, //hiển thị khi duyệt object
            configurable : false // không thể xoá hoặc thay đổi
        });
    }

    //hàm nâng cấp thành viên
    upgrade(){
        if(this.membershipLever === "Basic"){
            console.log(`Khách hàng ${this.name} đã được nâng cấp lên VIP !`);
        }
        else{
            console.log(`Khách hàng ${this.name} đã được nâng cấp lên VIP rồi !`);
        }
    }
}

//kiểm tra tư cách thành viên
const vipClient = new PremiumClient("Nguyễn Đình Tú", "dinhtu20091998@gmail.com", "0336620188");

console.log(vipClient.getContactInfor());
console.log("Cấp thành viên: ", vipClient.membershipLever);
vipClient.upgrade();

//thử đổi cấp thành viên
vipClient.membershipLever = "Super Vip";
console.log("Cấp thành viên sau khi thử đổi: ", vipClient.membershipLever);//Basic

//kiểm tra kiểu đối tượng có prototype của class khác
console.log(vipClient instanceof PremiumClient);//true
console.log(vipClient instanceof Client);//true





