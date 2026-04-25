const API_URL = "http://localhost:4000/users";

//khi người dùng đăng nhập
document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    //nhận thông tin từ form
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    //kiểm tra hợp lệ
    try{
        //lấy dữ liệu
        const res = await fetch(`${API_URL}`);
        const users = await res.json();

        //tìm tài khoản admin
        const admin = users.find(u => u.email === email && u.password === password && u.role === "admin");

        //nếu tìm được thì lưu vào phiên local
        if(admin){
            localStorage.setItem("admin", JSON.stringify(admin));
            window.location.href = "index.html";
            alert("Đăng nhập thành công!");
            return;
        }
        else{
            alert("Bạn điền sai thông tin và mật khẩu !");
            return;
        }
    }
    catch(err){
        console.log("Lỗi khi kiểm tra đăng nhập !", err);
    }
});