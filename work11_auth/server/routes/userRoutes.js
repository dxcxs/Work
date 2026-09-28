const express = require('express');
const router = express.Router();
const Users = require('../models/user');

// API: เข้าสู่ระบบ และตั้งค่า คุกกี้
router.post('/login', async (req, res) => {
  try {
    const { username, password, theme } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    // 1. ค้นหา username ใน MongoDB
    const user = await Users.findOne({ username: username });

    // 2. หากไม่พบผู้ใช้งานในระบบ
    if (!user) {
      return res.status(404).json({ success: false, message: 'ไม่พบชื่อผู้ใช้ในระบบ' });
    }

    // 3.check password
    if(user.password != password){
      return res.status(401).json({
        success: false,
        message: "รหัสผ่านไม่ถูกต้อง"
      })
    }
    req.session.user = {
      id: user._id,
      username: user.username,
      type: user.type
    }

    // 4. ตั้งค่า cookie สำหรับ theme (เพิ่ม path: '/')
    res.cookie('theme', theme || 'light', {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/' // <--- กำหนด path เพื่อให้เรียกใช้ได้ทั่วทั้งเว็บ
    });

    return res.json({ 
      success: true, 
      message: 'เข้าสู่ระบบสำเร็จ', 
      user: { username: user.username, type: user.type } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
});

// API: ดึงข้อมูลผู้ใช้และธีมจาก คุกกี้
router.get('/info', (req, res) => {
  const user = req.session.user;
  const theme = req.cookies.theme || 'light';
  if(user){
    res.json({
      isLoggedIn: true,
      user: user,
      theme: theme
    });
  }else{
    res.json({
      isLoggedIn: false,
      username: null,
      theme: 'light'
    });
  }
});

// API: ออกจากระบบ และลบ คุกกี้ (เพิ่ม path: '/' ใน clearCookie)
router.post('/logout', (req, res) => {
  if(req.session){
    req.session.destroy((err) =>{
      if(err){
        console.error("ไม่สามารถทำลาย session", err);
        return res.status(500).json({
          success: false,
          message: "ไม่สามารถออกจากระบบ"
        });
      }
      res.clearCookie('connect.sid',{path:'/'});
      res.clearCookie('theme', { path: '/' });    // <--- ต้องใส่ path เดียวกันกับตอน res.cookie
      res.json({ success: true, message: 'ออกจากระบบแล้ว' });
    })
  }else{
    res.json({
      success: true,
      message: "ไม่มี session ค้างอยู่"
    })
  }
});

const requireAdmin =(req,res,next) =>{
  if(!req.session || !req.session.user){
    return res.status(401).json({
      success: false,
      message: "กรุณาเข้าสู่ระบบก่อนใช้งาน"
    })
  }
  if(req.session.user.type != 'admin'){
    return res.status(403).json({
      success: false,
      message: "ไม่สามารถใช้งานได้ สำหรับผู้ดูแลระบบเท่านั้น"
    })
  }
  next();
}
router.requireAdmin = requireAdmin;

module.exports = router;