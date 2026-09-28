require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // 1. เรียกใช้โมดูล path

// xxx ติดตั้ง middleware ใช้แพกเกจ express-session
const session = require("express-session");

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cookieParser()); 
app.use(cors());
app.use(express.json());
// xxx
app.use(session({
    secret: 'npru_cafe_secret_key_2026', // รหัสลับสำหรับ sign/encrypt session ID cookie (ตั้งเป็นข้อความสุ่มได้)
    resave: false,                         // ป้องกันการบันทึก session ซ้ำ หากไม่มีการแก้ไขข้อมูล
    saveUninitialized: false,              // ไม่สร้าง session จนกว่าจะมีข้อมูลถูกบันทึก (ช่วยประหยัดพื้นที่เก็บ)
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,      // ระยะเวลาหมดอายุของ Cookie (เช่น 1 วัน)
        httpOnly: true,                    // ป้องกันไม่ให้ JavaScript ฝั่ง Client อ่าน Cookie นี้ได้
        secure: false                      // ตั้งเป็น true หากใช้ HTTPS (พัฒนาใน localhost ให้ใช้ false)
    }
}));

// 3. ปรับ Path สำหรับ Static files
app.use(express.static(path.join(__dirname, '../public'))); 

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Route หน้าแรก
app.get('/', (req, res) => {
    // 4. ใช้ path.join รวม Path ของไฟล์ login.html
    res.sendFile(path.join(__dirname, '../public', 'login.html')); 
});

// Use Routes
app.use('/api/menu', menuRoutes);     
app.use('/api/menus', menuRoutes);     
app.use('/api/orders', orderRoutes);     
app.use('/api/users', userRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});