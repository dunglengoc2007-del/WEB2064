//đường dẫn đến file db.json
const API_URL = "http://localhost:4000/users";

//lấy thông tin người dùng đăng nhập từ localStorage
const userData = JSON.parse(localStorage.getItem("user"));

// nếu chưa đăng nhập thì quay lại trang login
if (!userData) {
    alert("Vui lòng đăng nhập trước!");
    window.location.href = "login.html";
}

// hiển thị thông tin lên form
document.getElementById("name").value = userData.name || "";
document.getElementById("email").value = userData.email || "";
document.getElementById("phone").value = userData.phone || "";
document.getElementById("address").value = userData.address || "";

//xử lý khi cập nhật form
document.getElementById("user-form").addEventListener("submit", async (e) =>{
    //ngăn gửi mặc định
    e.preventDefault();

    //thay dữ liệu cũ thành dữ liệu mới từ form cập nhật thông tin người dùng
    const updatedUser = {
        ...userData,
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
    };

    //gửi request PUT về server để yêu cầu thay đổi
    const res = await fetch(`${API_URL}/${userData.id}`,{
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(updatedUser),
    });

    //xét cập nhật lại localstorage
    if(res.ok){
        //cập nhật lại localstorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Cập nhật thông tin người dùng thành công !");
    }
    else{
        alert("Cập nhật thông tin người dùng thất bại !");
    }
});

//hàm đăng xuất tài khoản
document.getElementById("logout-btn").addEventListener("click", ()=>{
    if(confirm("Bạn có chắc chắn muốn đăng xuất ?")){
        //xoá thông tin người dùng đã lưu
        localStorage.removeItem("user");
        alert("Đã đăng xuất !");

        //chuyển hướng về đăng nhập
        window.location.href = "login.html";
        return;
    }
});