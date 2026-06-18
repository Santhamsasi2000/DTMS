require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors"); 
const path = require("path"); 
const connectDB = require("./config/db"); 
const receiptRoutes = require("./routes/receiptRoutes");
const cloudinary = require("./config/cloudinary")

connectDB(); 

const app = express(); app.use(cors( 
  { origin: "http://localhost:5173", 
    credentials: true, } 
  )); 

app.use(express.json()); app.use(express.urlencoded({ extended: true })); 

// Routes 
app.use("/api/receipts", receiptRoutes);

app.get("/", (req, res) => res.send("EPFO Tapal Backend Running"));


// Test cloudinary Connection
cloudinary.api.ping()
    .then(() => console.log("✅ Cloudinary Connected"))
    .catch((err) => console.log("❌ Cloudinary Error:", err));

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));