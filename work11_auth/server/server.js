require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path'); // 1. เรียกใช้โมดูล path

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cookieParser()); 

app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'npru_cafe_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24*60*60*1000,
        httpOnly: true,
        secure: false
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