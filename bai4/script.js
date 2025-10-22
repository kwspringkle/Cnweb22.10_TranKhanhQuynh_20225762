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
            product.style.display = '';
        } else {
            product.style.display = 'none';
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
    // Clear error message khi mở/đóng form
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.textContent = '';
    }
}

addProductBtn.addEventListener('click', toggleProductForm);
cancelAddBtn.addEventListener('click', () => {
    toggleProductForm();
    addProductForm.reset();
});

// Hàm validate dữ liệu
function validateProductData(name, price, desc, imageUrl) {
    const errors = [];
    
    // Kiểm tra tên sản phẩm
    if (!name || name.trim() === '') {
        errors.push('Tên sản phẩm không được để trống');
    }
    
    // Kiểm tra giá
    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
        errors.push('Giá phải là số hợp lệ và lớn hơn 0');
    }
    
    // Kiểm tra mô tả (tùy chọn - không quá ngắn)
    if (desc && desc.trim().length < 10) {
        errors.push('Mô tả phải có ít nhất 10 ký tự');
    }
    
    // Kiểm tra URL hình ảnh
    if (!imageUrl || imageUrl.trim() === '') {
        errors.push('URL hình ảnh không được để trống');
    } else {
        try {
            new URL(imageUrl);
        } catch (e) {
            errors.push('URL hình ảnh không hợp lệ');
        }
    }
    
    return errors;
}

// Hiển thị thông báo lỗi
function showError(message) {
    let errorMsg = document.getElementById('errorMsg');
    
    // Nếu chưa có phần tử errorMsg, tạo mới
    if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.id = 'errorMsg';
        errorMsg.className = 'error-message';
        addProductForm.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

// Ẩn thông báo lỗi
function hideError() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    }
}

// Xử lý submit form thêm sản phẩm
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Ẩn lỗi cũ
    hideError();
    
    // Lấy giá trị từ form
    const name = document.getElementById('productName').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    
    // Validate dữ liệu
    const errors = validateProductData(name, price, desc, image);
    
    if (errors.length > 0) {
        // Hiển thị lỗi đầu tiên
        showError(errors[0]);
        return;
    }
    
    // Tạo sản phẩm mới
    const newProduct = document.createElement('article');
    newProduct.className = 'product-item';
    newProduct.innerHTML = `
        <h3>${name}</h3>
        <div class="product-media">
            <img src="${image}" alt="${name}" onerror="this.src='https://via.placeholder.com/300x200?text=Không+tìm+thấy+ảnh'">
        </div>
        <p>${desc}</p>
        <p class="price">Giá: <span>${Number(price).toLocaleString('vi-VN')}₫</span></p>
    `;
    
    // Thêm sản phẩm vào đầu danh sách
    productList.insertBefore(newProduct, productList.firstChild);
    
    // Reset form và ẩn đi
    addProductForm.reset();
    toggleProductForm();
    
    // Hiển thị thông báo thành công (tùy chọn)
    alert('Đã thêm sản phẩm mới thành công!');
});