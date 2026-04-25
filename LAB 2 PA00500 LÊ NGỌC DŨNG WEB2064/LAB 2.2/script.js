 //render header
    const header = document.getElementById("header");
    header.innerHTML = `
        <header>
            <h1>🍹 FreshDrinks</h1>
            <nav>
                <ul>
                    <li><a href="#">Trang chủ</a></li>
                    <li><a href="#">Sản phẩm</a></li>
                    <li><a href="#">Khuyến mãi</a></li>
                    <li><a href="#">Liên hệ</a></li>
                </ul>
            </nav>
        </header>
    `;

    //render footer
    const footer = document.getElementById("footer");
    footer.innerHTML = `
        <footer>
            <div class="footer-container">
                <div class="footer-col">
                    <h3>🍹 FreshDrinks</h3>
                    <p>Thương hiệu nước giải khát tươi mát, 
                    mang lại năng lượng cho mọi khoảnh khắc.</p>
                </div>
                <div class="footer-col">
                    <h3>Liên kết</h3>
                    <a href="#">Trang chủ</a>
                    <a href="#">Sản phẩm</a>
                    <a href="#">Khuyến mãi</a>
                    <a href="#">Liên hệ</a>
                </div>
                <div class="footer-col">
                    <h3>Hỗ trợ</h3>
                    <a href="#">FAQ</a>
                    <a href="#">Chính sách bảo mật</a>
                    <a href="#">Điều khoản dịch vụ</a>
                    <a href="#">Góp ý</a>
                </div>
                <div class="footer-col">
                    <h3>Liên hệ</h3>
                    <p>Email: hson97805@gmail.com</p>
                    <p>Hotline: 0985565948</p>
                </div>
            </div>
            <div class="footer-bottom">
                © 2025 FreshDrinks. All Rights Reserved.
            </div>
        </footer>
    `;