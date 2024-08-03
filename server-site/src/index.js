import { app } from "./app.js";
import { PORT } from "./constant.js";
//import connectDB, { dbConnect } from "./db/index.js";
import connectDB from "./db/index.js";

//dbConnect()
connectDB()


app.listen(PORT, ()=> {
    console.log("Server is running")
})