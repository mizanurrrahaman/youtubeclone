import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express";
//import userRouter from "./routes/user.routes.js"
import userRouter  from "./routes/user.routes.js"


const app = express()

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))
app.use(cors({
    origin: "*"
}))

app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user", userRouter)

//N39LGMuWHCWLMyXK
//murad
export {app} 