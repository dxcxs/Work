const express = require('express');
const router = express.Router();
const Menus = require('../models/menu');

// ดึงรายการเมนู (ทั้งหมด หรือ ตามหมวดหมู่)
router.get('/:filter', async (req, res) => {
    try {
        const { filter } = req.params;
        let menuItems;
        if (filter === 'all') {
            menuItems = await Menus.find();
        } else {
            menuItems = await Menus.find({ cat: filter });
        }
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// เพิ่มเมนูใหม่
router.post('/', async (req, res) => {
    try {
        const newMenuItem = new Menus(req.body);
        await newMenuItem.save();
        res.status(201).json(newMenuItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ลบเมนู
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMenuItem = await Menus.findByIdAndDelete(id);
        if (!deletedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted', deletedMenuItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// แก้ไขข้อมูลเมนู (เช่น แก้ไขราคา)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMenuItem = await Menus.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedMenuItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;