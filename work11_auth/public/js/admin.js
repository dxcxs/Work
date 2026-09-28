function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function applyTheme(t) {
    if (t === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
}

async function loadAdminMenu() {
    try {
        const response = await fetch('http://localhost:3000/api/menu/all');
        const menuItems = await response.json();
        const container = document.getElementById('admin-menu-list');
        if (!container) return;

        container.innerHTML = '';
        menuItems.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.style.padding = "12px 0";
            row.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.name}</strong> (${item.cat || '-'})<br>
                    <span>ราคาปัจจุบัน: ${Number(item.price).toFixed(2)} บาท | ประเภท: ${item.type || '-'}</span>
                </div>
                <div class="action-buttons" style="padding:0;">
                    <button class="edit-button" data-id="${item._id}">แก้ไขราคา</button>
                    <button class="delete-button" data-id="${item._id}">ลบ</button>
                </div>
            `;
            container.appendChild(row);

            // ปุ่มลบ
            row.querySelector('.delete-button').addEventListener('click', async () => {
                if (confirm(`คุณต้องการลบ "${item.name}" ใช่หรือไม่?`)) {
                    await fetch(`http://localhost:3000/api/menu/${item._id}`, { method: 'DELETE' });
                    loadAdminMenu();
                }
            });

            // ปุ่มแก้ไขราคา
            row.querySelector('.edit-button').addEventListener('click', () => {
                if (row.querySelector('.edit-form')) return;

                const editForm = document.createElement('form');
                editForm.className = 'edit-form';
                editForm.style.marginTop = "8px";
                editForm.innerHTML = `
                    <input type="number" name="price" value="${item.price}" step="0.01" required style="width: 100px; padding: 4px;" />
                    <button type="submit" class="submit-btn" style="width: auto; padding: 4px 10px;">บันทึก</button>
                `;
                row.querySelector('.cart-item-info').appendChild(editForm);

                editForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const newPrice = parseFloat(editForm.querySelector('input[name="price"]').value);
                    const res = await fetch(`http://localhost:3000/api/menu/${item._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ price: newPrice })
                    });
                    if (res.ok) {
                        alert('แก้ไขราคาเรียบร้อยแล้ว');
                        loadAdminMenu();
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error loading admin menu:', error);
    }
}

async function handleAddMenu(event) {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById('name').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        type: document.getElementById('type').value,
        cat: document.getElementById('cat').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            alert('เพิ่มเมนูสำเร็จ!');
            document.getElementById('add-menu-form').reset();
            loadAdminMenu();
        } else {
            alert('ไม่สามารถเพิ่มเมนูได้');
        }
    } catch (error) {
        console.error('Error adding menu:', error);
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    const response = await fetch('http://localhost:3000/api/users/info');
    const authData = await response.json();

    const theme = getCookie('theme') || 'light';

    if (!authData.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    if(authData.user.type !== "admin"){
        alert("admin เท่านั้น");
        window.location.href = "index.html";
        return;
    }

    // 2. แสดงผล User & Theme
    const displayNameEl = document.getElementById('displayName');
    if (displayNameEl && authData.user) displayNameEl.textContent = `${authData.user.username}(admin)`;
    loadAdminMenu();


// ค้นหาปุ่ม Logout
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); // ป้องกันการส่งฟอร์มหากปุ่มอยู่ในฟอร์ม

        // 1. ลบ Cookie 'username' (ลบทั้ง path ปกติและ domain)
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "username=; max-age=0; path=/;";

        // 2. เคลียร์ข้อมูลตะกร้าที่ค้างใน localStorage (ถ้าต้องการ)
        localStorage.removeItem('cart');

        // 3. เด้งกลับไปหน้า login.html
        window.location.href = 'login.html';
    });
}

    document.getElementById('add-menu-form')?.addEventListener('submit', handleAddMenu);

    
});