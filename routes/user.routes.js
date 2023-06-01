const express = require("express")

const { UserModel } = require("../models/users.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRouter = express.Router()


//register the user
userRouter.post("/register", async (req, res) => {
    const { name, email, password, address } = req.body

    try {
        const user = await UserModel.find({ email })
        console.log(user)
        if (user.length > 0) {
            res.send({ "msg": "user Already exist" })
        } else {
            bcrypt.hash(password, 5, async function (err, hash) {
                if (err) {
                    res.send({ "msg": "Something went wrong" })
                } else {
                    const user = new UserModel({ name, email, password: hash, address })
                    await user.save()
                    res.status(201).send({ "msg": "new user register" })
                }
            })
        }
    } catch (error) {
        res.send({ "msg": "Something went wrong", "error": error.message })
    }
})


//login the user

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.find({ email })
        console.log(user)

        if(user.length>0){
            bcrypt.compare(password,user[0].password,function(err,result){
                if(result){
                    let token=jwt.sign({userID:user[0]._id},"masai",{expiresIn:"1h"})
                    res.status(201).send({"msg":"Sucessfully Login","token":token,"user":user[0]._id})
                }
            })
        }else{
            res.send({"msg":"Wrong Creadential"})
        }
    } catch (error) {
        res.send({ "msg": "Something went wrong", "error": error.message })
    }
})

// userRouter.patch("/user/:id/reset",async (req,res)=>{
//     const userId=req.params.id

//     const{password,newpassword}=req.body

//     try {
//         const user=await UserModel.findById({"_id":userId})

//         if(!user){
//             res.status(404).send({"msg":"user not find"})
//         }else{
//             passwordmatch=await bcrypt.compare(password,user.password)

//             if(!passwordmatch){
//                 res.status(401).send({"msg":"password doesnt match"})
//             }else{
//                 const hash=await bcrypt.hash(newpassword,5)
//                 user.password=hash

//                 await user.save()

//                 res.status(204).send({"msg":"update the passsword"})
//             }
//         }
//     } catch (error) {
//         res.send({ "msg": "Something went wrong", "error": error.message })
//     }
// })

module.exports = { userRouter }