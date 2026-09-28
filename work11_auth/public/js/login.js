document.addEventListener('DOMContentLoaded', async() => {
    try{
        const res = await fetch('http://localhost:3000/api/users/info');
        const data = await res.json();
        if(data.isLoggedIn){
            window.location.href = "index.html";
            return;
        }
    }catch(err){
        console.log("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const theme = document.getElementById('themeSelect').value;

            try {
                const res = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, theme })
                });

                const data = await res.json();

                if (data.success) {
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
                }
            } catch (err) {
                console.error(err);
                alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
            }
        });
    }
});