// khai báo đường dẫn tới json
const API_PRO = "http://localhost:4000/products";

const API_CATE = "http://localhost:4000/categories";
//json-server --watch db.json --port 4000

//load danh mục
async function loadCategories(){
    try{
        let res = await fetch(API_CATE);
        let categories = await res.json();

        let menu = document.getElementById("category-menu");
        menu.innerHTML = `
            <li data-id="" class="ca-item">Tất cả</li>
            ${categories.map(c => `<li data-id="${c.id}" class="ca-item">${c.name}</li>`).join("")}
        `;

        //gắn sự kiện click cho từng danh mục
        document.querySelectorAll("#category-menu li").forEach(li => {
            li.addEventListener("click",()=>{
                const cateId = li.dataset.id;
                loadProducts(cateId);
            });
        });
    }
    catch(err){
        console.log("Lỗi khi load danh mục sản phẩm !", err);
    }
}


//load danh sách sản phẩm
async function loadProducts(cateId = null){
    try{
        // Nếu có cateId, thêm query param vào URL
        let url = cateId ? `${API_PRO}?cate_id=${cateId}` : API_PRO;

        let res = await fetch(url);//gửi request tới api để chờ lấy dữ liệu
        let products = await res.json();//chuyển đổi dữ liệu nhận được từ json thành js object

        let list = document.getElementById("product-list");
        list.innerHTML = products.map(p => `
            <div class="product">
                <img src="../images/${p.image}" alt="${p.name}" width="150" height="100">
                <h3>${p.name}</h3>
                <p>${p.detail}</p>
                <p><strong>Giá: ${p.price} VND</strong></p>
                <button onclick="viewDetail(${p.id})">Xem chi tiết</button>
            </div>
        `).join("");
    }
    catch(err){
        console.log("Lỗi khi load sản phẩm !",err);
    }
}

// Hàm hiển thị kết quả tìm kiếm sản phẩm
function renderProducts(products) {
    let list = document.getElementById("product-list");
    list.innerHTML = products.map(p => `
        <div class="product">
            <img src="../images/${p.image}" alt="${p.name}" width="150" height="100">
            <h3>${p.name}</h3>
            <p>${p.detail}</p>
            <p><strong>Giá: ${p.price} VND</strong></p>
            <button onclick="viewDetail(${p.id})">Xem chi tiết</button>
        </div>
    `).join("");
}

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    return str
        .normalize("NFD") // tách dấu
        .replace(/[\u0300-\u036f]/g, "") // xóa dấu
        .replace(/đ/g, "d").replace(/Đ/g, "D");
}

// Hàm tìm kiếm sản phẩm
async function searchProducts() {
    const keyword = document.getElementById("search-input").value.trim().toLowerCase();
    if (!keyword) {
        loadProducts();
        return;
    }

    try {
        // Lấy toàn bộ sản phẩm
        const res = await fetch(API_PRO);
        const products = await res.json();

        // Bỏ dấu cho từ khóa
        const normalizedKeyword = removeVietnameseTones(keyword);

        // Lọc sản phẩm
        const filtered = products.filter(p => {
            const name = removeVietnameseTones(p.name.toLowerCase());
            const detail = removeVietnameseTones(p.detail.toLowerCase());
            return (
                name.includes(normalizedKeyword) ||
                detail.includes(normalizedKeyword)
            );
        });

        renderProducts(filtered);
    } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
    }
}



//chuyển sang trang chi tiết
function viewDetail(id){
    window.location.href = `product_detail.html?id=${id}`;
}

loadCategories();
loadProducts();