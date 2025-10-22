// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAddBtn = document.getElementById('cancelAdd');
const productList = document.getElementById('product-list');

// LocalStorage key
const STORAGE_KEY = 'tocotoco_products';

// Dữ liệu sản phẩm mẫu ban đầu
const defaultProducts = [
    {
        name: 'Trà Sữa Trân Châu Đường Đen',
        image: 'https://tocotocotea.com/wp-content/uploads/2025/08/Tra-sua-hanh-phuc-1.jpg',
        desc: 'Thức uống được yêu thích với vị ngọt dịu, béo ngậy và trân châu dẻo mềm.',
        price: 35000
    },
    {
        name: 'Trà Xanh Macchiato',
        image: 'https://tocotocotea.com/wp-content/uploads/2025/06/Xanh-Nhai-Vai-Que-Hoa.jpg',
        desc: 'Vị trà xanh tươi mát kết hợp lớp kem sữa mịn màng.',
        price: 40000
    },
    {
        name: 'Trà Sữa Khoai Môn',
        image: 'https://tocotocotea.com/wp-content/uploads/2025/08/Chien-than-topping-khong-lo.jpg',
        desc: 'Vị khoai môn thơm béo, ngọt dịu, được nhiều khách hàng yêu thích.',
        price: 38000
    }
];

// Lấy danh sách sản phẩm từ localStorage
function getProductsFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Lỗi parse JSON:', e);
            return defaultProducts;
        }
    }
    return null; // Chưa có dữ liệu
}

// Lưu danh sách sản phẩm vào localStorage
function saveProductsToStorage(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Khởi tạo localStorage với dữ liệu mặc định nếu chưa có
function initializeStorage() {
    const existingProducts = getProductsFromStorage();
    if (!existingProducts) {
        saveProductsToStorage(defaultProducts);
        return defaultProducts;
    }
    return existingProducts;
}

// Tạo HTML element cho một sản phẩm
function createProductElement(product) {
    const article = document.createElement('article');
    article.className = 'product-item';
    
    article.innerHTML = `
        <h3>${product.name}</h3>
        <div class="product-media">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Không+tìm+thấy+ảnh'">
        </div>
        <p>${product.desc}</p>
        <p class="price">Giá: <span>${Number(product.price).toLocaleString('vi-VN')}₫</span></p>
    `;
    
    return article;
}

// Render toàn bộ danh sách sản phẩm
function renderProducts(products) {
    // Xóa tất cả sản phẩm hiện tại
    productList.innerHTML = '';
    
    // Thêm từng sản phẩm vào danh sách
    products.forEach(product => {
        const productElement = createProductElement(product);
        productList.appendChild(productElement);
    });
}

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
    hideError();
    
    // Lấy giá trị từ form
    const name = document.getElementById('productName').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const errors = validateProductData(name, price, desc, image);
    
    if (errors.length > 0) {
        showError(errors[0]);
        return;
    }
    
    // Tạo object sản phẩm mới
    const newProduct = {
        name: name,
        image: image,
        desc: desc,
        price: Number(price)
    };
    
    // Lấy danh sách sản phẩm hiện tại từ localStorage
    const products = getProductsFromStorage();
    
    // Thêm sản phẩm mới vào đầu mảng và lưu vào LocalStorage
    products.unshift(newProduct);
    saveProductsToStorage(products);
    
    // Tạo element HTML và thêm vào đầu danh sách
    const productElement = createProductElement(newProduct);
    productList.insertBefore(productElement, productList.firstChild);
    
    // Reset form và ẩn đi
    addProductForm.reset();
    toggleProductForm();
    alert('Đã thêm sản phẩm mới thành công!');
});

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo localStorage và lấy dữ liệu
    const products = initializeStorage();
    renderProducts(products);
    
    console.log('Đã tải', products.length, 'sản phẩm từ localStorage');
});