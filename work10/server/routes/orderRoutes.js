const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// บันทึกคำสั่งซื้อใหม่
router.post('/', async (req, res) => {
    try {
        const { items, totalPrice, totalCount } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'ไม่มีรายการสินค้าในตะกร้า' });
        }

        const newOrder = new Order({ items, totalPrice, totalCount });
        await newOrder.save();
        res.status(201).json({ message: 'สั่งซื้อสำเร็จ', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ดึงรายการสั่งซื้อทั้งหมด (สำหรับหน้า Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;