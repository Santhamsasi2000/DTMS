require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors"); 
const path = require("path"); 

const connectDB = require("./config/db"); 
const receiptRoutes = require("./routes/receiptRoutes");
const authRoutes = require("./routes/authRoutes");
const cloudinary = require("./config/cloudinary");

connectDB(); 

const app = express(); 

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://epfo-dtms.vercel.app",
];
		
		app.use(
		  cors({
		    origin: (origin, callback) => {
		      if (!origin) return callback(null, true);
		      if (allowedOrigins.includes(origin)) callback(null, true);
		      else callback(new Error(`CORS: ${origin} not allowed`));
		    },
		    credentials:    true,
		    methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		    allowedHeaders: ["Content-Type", "Authorization"],
		  })
		);


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Routes 
app.use("/api/auth", authRoutes)
app.use("/api/receipts", receiptRoutes);

app.get("/", (req, res) => res.send("EPFO Tapal Backend Running"));


// Test cloudinary Connection
cloudinary.api.ping()
    .then(() => console.log("✅ Cloudinary Connected"))
    .catch((err) => console.log("❌ Cloudinary Error:", err));

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));