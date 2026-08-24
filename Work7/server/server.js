require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("../public"))

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Success!"))
.catch(err => console.error("Fail!"))

const menu_schema = new mongoose.Schema({
    name: String,
    price: Number,
    cat: String
})

const menus = mongoose.model("menus", menu_schema)

app.get("/api/menus/:filter", async (req, res) => {

    try {
        const {filter} = req.params
        let menu_items

        if (filter==="all") {
            menu_items = await menus.find()
        } else {
            menu_items = await menus.find({cat: filter})
        }

        res.json(menu_items)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    
})

const port = process.env.PORT
app.listen(port, () => {
    console.log("Server device is connected succesfuly!")
})