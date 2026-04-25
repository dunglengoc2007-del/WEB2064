//json-server --watch db.json --port 4001

//đường dẫn
const API_URL = "http://localhost:4001/students";

//hàm lấy danh sách sinh viên
async function loadStudents(){
    try{
        const res = await fetch(API_URL);
        if(!res.ok) throw new Error("Lỗi khi tải dữ liệu !");

        const students = await res.json();
        const tbody = document.getElementById("student-list");

        tbody.innerHTML = students.map(s =>`
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.dob}</td>
                <td>${s.gender}</td>
            </tr>
        `);
    }
    catch(err){
        console.error(err);
    }
}

loadStudents();