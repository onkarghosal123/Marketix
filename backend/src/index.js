import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { dbConnect } from "./config/dbconnection.js";
import { ENV } from "./config/env.js";
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import sellerRoutes from "./routes/sellerRoutes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

const app = express();
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }));
app.use(express.json());
app.use(cookieParser());//if i not write this line then in checkauthadmin req.cookies shows undefined.It reads the incoming Cookie 

app.use("/user",userRoutes);
app.use("/admin",adminRoutes);
app.use("/seller",sellerRoutes)
app.use("/server-check",(req,res)=>{
    res.send(`Server is running on port ${ENV.PORT}...`)
})

// Serve the built React frontend
app.use(express.static(publicPath));

// React Router fallback
app.get(/.*/, (req, res, next) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(ENV.PORT,()=>{
    console.log("server is running on port:",ENV.PORT)
    dbConnect();
})
