require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors"); 
const path = require("path"); 
const connectDB = require("./config/db"); 
const receiptRoutes = require("./routes/receiptRoutes"); 

connectDB(); 

const app = express(); app.use(cors( { origin: "http://localhost:5173", credentials: true, } )); 

app.use(express.json()); app.use(express.urlencoded({ extended: true })); 
// Static uploads folder
 app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  // Routes 
app.use("/api/receipts", receiptRoutes);

 app.get("/", (req, res) => res.send("EPFO Tapal Backend Running"));

 const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));