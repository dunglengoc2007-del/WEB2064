//khai báo đường dẫn db
const API_URL = "http://localhost:4000/users";

//nếu nhận được email của form quên mật khẩu
document.getElementById("forgot-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    //lấy dữ liệu từ form
    const email = document.getElementById("email").value.trim();

    try{
        //lấy dữ liệu từ db json kiểm tra
        const res = await fetch(`${API_URL}?email=${email}`);
        const users = await res.json();

        if(users.length === 0){
            alert("Không tìm thấy tài khoản với email này !");
            return;
        }

        //lấy kết quả dòng đầu và yêu cầu nhập mật khẩu mới
        const user = users[0];
        const newPass = prompt(`Nhập mật khẩu mới cho tài khoản ${user.email}: `);
        if(!newPass) return;

        //cập nhật mật khẩu trong file db json
        await fetch(`${API_URL}/${user.id}`,{
            method : "PATCH",
            headers : {"Content-Type":"application/json"},
            body : JSON.stringify({password: newPass})
        });

        //thông báo
        window.location.href = "login.html";
        alert("Mật khẩu được cập nhật thành công ! Hãy đăng nhập nào.");

    }
    catch(err){
        console.log("Lỗi khi cập nhật mật khẩu !", err);
    }
});