let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ดึงค่า Cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// สลับธีม
function applyTheme(t) {
    if (t === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

// อัปเดตจำนวนสินค้าตรงไอคอนตะกร้า
function updateCartCountUI() {
    const navCartCount = document.getElementById('navCartCount');
    if (navCartCount) {
        const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        navCartCount.textContent = totalCount;
    }
}

// ฟังก์ชันใส่ตะกร้า
function addToCart(product) {
    if (!product) return;
    
    const productId = product._id || product.id || product.name;
    const existingItem = cart.find(item => (item._id && item._id === productId) || item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            _id: productId,
            name: product.name || 'ไม่มีชื่อสินค้า',
            price: Number(product.price) || 0,
            type: product.type || '',
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountUI();
    alert(`เพิ่ม "${product.name}" ลงในตะกร้าเรียบร้อยแล้ว`);
}

// ดึงข้อมูลเมนูจาก Backend API
async function loadMenu(filter = "all") {
    const container = document.getElementById('menu-container');
    if (!container) return;

    try {
        container.innerHTML = '<p style="text-align:center;">กำลังโหลดรายการสินค้า...</p>';
        
        // เรียก API โดยปรับ Relative Path เพื่อหลีกเลี่ยงปัญหา CORS เมื่อเปลี่ยน Port
        const response = await fetch(`/api/menu/${filter}`);
        
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
        
        const menuItems = await response.json();

        if (!Array.isArray(menuItems) || menuItems.length === 0) {
            container.innerHTML = '<p style="text-align:center;">ไม่พบรายการสินค้าในหมวดหมู่นี้</p>';
            return;
        }

        container.innerHTML = ''; // เคลียร์ข้อความกำลังโหลด

        menuItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            
            const priceNum = Number(item.price) || 0;
            const itemType = item.type ? ` (${item.type})` : '';

            itemDiv.innerHTML = `
                <img class="menu-image" src="/img/${item.name}.jpg" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=NPRU+Cafe'" />
                <h3>${item.name}</h3>
                <p>ประเภท: <span class="type">${item.cat || item.category || 'ทั่วไป'}${itemType}</span></p>
                <p>ราคา: <span class="price">${priceNum.toFixed(2)} บาท</span></p>
                <div class="action-buttons">
                    <button type="button" class="order-button">🛒 ใส่ตะกร้า</button>
                </div>
            `;
            
            container.appendChild(itemDiv);

            // ผูก Event Listener ให้ปุ่มใส่ตะกร้า
            const orderBtn = itemDiv.querySelector('.order-button');
            if (orderBtn) {
                orderBtn.addEventListener('click', () => addToCart(item));
            }
        });

    } catch (error) {
        console.error('Error loading menu:', error);
        container.innerHTML = `<p style="text-align:center; color:red;">ไม่สามารถโหลดข้อมูลสินค้าได้ (โปรดตรวจสอบการเชื่อมต่อ API Server)</p>`;
    }
}

// ทำงานหลังจาก DOM โหลดเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', async() => {
    //xxx 1. ตรวจสอบการ Login 
    const response = await fetch('http://localhost:3000/api/users/info');
    const authData = await response.json();

    const theme = getCookie('theme') || 'light';

    if (!authData.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // 2. แสดงผล User & Theme
    const displayNameEl = document.getElementById('displayName');
    const displayThemeEl = document.getElementById('displayTheme');
    const switchThemeEl = document.getElementById('switchTheme');

    //xxx
    if (displayNameEl && authData.user) displayNameEl.textContent = authData.user.username;
    if (displayThemeEl) displayThemeEl.textContent = theme;
    if (switchThemeEl) switchThemeEl.value = theme;
    
    applyTheme(theme);

    // 3. ระบบ Logout
// ปุ่ม Logout ใน index.js
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            // เรียก API Logout ฝั่ง Server เพื่อลบ Cookie ออก
            await fetch('/api/users/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout error:', err);
        }

        // นำทางกลับหน้า Login
        window.location.href = 'login.html';
    });
}

    // 4. เปลี่ยนสลับธีม
    if (switchThemeEl) {
        switchThemeEl.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;
            document.cookie = `theme=${selectedTheme}; max-age=${7*24*60*60}; path=/;`;
            applyTheme(selectedTheme);
            if (displayThemeEl) displayThemeEl.textContent = selectedTheme;
        });
    }

    // 5. ปุ่มกรองหมวดหมู่สินค้า
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.id;
            loadMenu(category);
        });
    });

    // 6. โหลดข้อมูลเริ่มต้น
    updateCartCountUI();
    loadMenu('all');
});