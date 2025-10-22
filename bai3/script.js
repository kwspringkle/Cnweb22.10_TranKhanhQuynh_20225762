// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAddBtn = document.getElementById('cancelAdd');
const productList = document.getElementById('product-list');

// Tìm kiếm sản phẩm
function filterProducts(searchText) {
    const products = document.querySelectorAll('.product-item');
    const normalizedSearch = searchText.toLowerCase().trim();
    
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        if (title.includes(normalizedSearch) || searchText === '') {
            product.style.display = ''; // Hiện sản phẩm nếu khớp hoặc không có từ khóa
        } else {
            product.style.display = 'none'; // Ẩn sản phẩm nếu không khớp
        }
    });
}

// Xử lý sự kiện tìm kiếm
searchInput.addEventListener('input', (e) => {
    filterProducts(e.target.value);
});

searchBtn.addEventListener('click', () => {
    filterProducts(searchInput.value);
});

// Xử lý ẩn/hiện form thêm sản phẩm
function toggleProductForm() {
    addProductForm.classList.toggle('hidden');
}

addProductBtn.addEventListener('click', toggleProductForm);
cancelAddBtn.addEventListener('click', toggleProductForm);

// Xử lý submit form thêm sản phẩm
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn form submit mặc định

    // Lấy giá trị từ form
    const name = document.getElementById('productName').value;
    const image = document.getElementById('productImage').value;
    const desc = document.getElementById('productDesc').value;
    const price = document.getElementById('productPrice').value;

    // Tạo sản phẩm mới
    const newProduct = document.createElement('article');
    newProduct.className = 'product-item';
    newProduct.innerHTML = `
        <h3>${name}</h3>
        <div class="product-media">
            <img src="${image}" alt="${name}">
        </div>
        <p>${desc}</p>
        <p class="price">Giá: <span>${Number(price).toLocaleString('vi-VN')}₫</span></p>
    `;

    // Thêm sản phẩm vào danh sách
    productList.appendChild(newProduct);

    // Reset form và ẩn đi
    addProductForm.reset();
    toggleProductForm();
});