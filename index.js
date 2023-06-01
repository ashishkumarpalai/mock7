const express=require("express")
const {connection}=require("./configs/db")
const {userRouter}=require("./routes/user.routes")
const {restaurantRouter}=require("./routes/restaurant.routes")
// const {}=require("./routes/order.routes")
const{authentication}=require("./middleware/auth.middleware")
require("dotenv").config()


const app=express()

app.use(express.json())




app.get("/",(req,res)=>{
    res.send("Wellcome Food ordering Websites")
})



app.use("/api",userRouter)
app.use(authentication)
app.use("/api/restaurants",restaurantRouter)




app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to the DB")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is running ${process.env.port}`)
})