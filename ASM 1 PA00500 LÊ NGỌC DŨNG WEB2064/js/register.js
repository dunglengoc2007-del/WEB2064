//khai báo đường dẫn db json
const API_URL = "http://localhost:4000/users";

//khi form đăng ký được submit
document.getElementById("register-form").addEventListener("submit", async function(e) {
    //ngăn hành động mặc định của trình duyệt
    e.preventDefault();

    //lấy thông tin từ form đăng ký
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    //kiểm tra nếu email trùng
    const res = await fetch(`${API_URL}?email=${email}`);
    const users = await res.json();

    if(users.length > 0){
        alert("Email đã được đăng ký !");
        return;
    }

    //ngược lại thì thêm người dùng mới
    await fetch(API_URL,{
        method : "POST",
        headers: {"Content-Type" : "application/json"},
        body : JSON.stringify({
            name,
            email, 
            password, 
            phone, 
            address,
            role : "user"
        })
    });

    //chuyển hướng đăng nhập và thông báo
    window.location.href = "login.html";
    alert("Đăng ký thành công ! Mời bạn đăng nhập.");
});