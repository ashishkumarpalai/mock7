const express=require("express")
const {RestaurantModel}=require("../models/restaurants.model")
const {MenuModel}=require("../models/menu.model")

const restaurantRouter=express.Router()


//get all restaurantdata
restaurantRouter.get("/",async(req,res)=>{
    try {
        let restaurantdata=await RestaurantModel.find()
        res.status(200).send(restaurantdata)
    } catch (error) {
        res.status(404).send({"msg":"something getting wrong","error":error.message})
    }
})


//get ID wise restaurantdata
restaurantRouter.get("/:id",async(req,res)=>{
    let id=req.params.id
    try {
        let restaurantdata=await RestaurantModel.findById(id)
        res.status(200).send(restaurantdata)
    } catch (error) {
        res.status(404).send({"msg":"something getting wrong","error":error.message})
    }
})



//add restaurantdata

restaurantRouter.post("/",async(req,res)=>{
    
    try {
        const {name,address}=req.body
        let menu=[]
        let restaurantdata=new RestaurantModel({name,address,menu})

        await restaurantdata.save()
        res.status(200).send(restaurantdata)
    } catch (error) {
        res.status(404).send({"msg":"something getting wrong","error":error.message})
    }
})

//add menu 
restaurantRouter.post("/:id/menu",async(req,res)=>{
    
    try {
        let id=req.params.id
        const {name,description,price,image}=req.body
        let menudata=new MenuModel({name,description,price,image})

        let restaurantdata=await RestaurantModel.find({_id:id})
        restaurantdata[0].menu.push(menudata)
        await restaurantdata[0].save()

        res.status(200).send({"msg":"Menu data added succesfully"})
    } catch (error) {
        res.status(404).send({"msg":"something getting wrong","error":error.message})
    }
})
//get id by menu
restaurantRouter.get("/:id/menu",async(req,res)=>{
    
    try {
        let id=req.params.id
        
        let restaurantdata=new RestaurantModel.find({_id:id})
        
        let menudata=restaurantdata[0].menu
        
        res.status(200).send(menudata)
    } catch (error) {
        res.status(404).send({"msg":"something getting wrong","error":error.message})
    }
})

//delete id by menu data

restaurantRouter.delete("/:id/menu/:menuid",async(req,res)=>{
    
    try {
        let id=req.params.id
        let menuid=req.params.menuid

        let restaurantdata=new RestaurantModel.find({_id:id})
    
        let menudata=restaurantdata[0].menu
        
        let newmenudata=menudata.filter((e)=>e._id!=menuid)
        restaurantdata[0].menu=newmenudata
        await restaurantdata[0].save()

        res.status(200).send("Successfully Deleted")
    } catch (error) {
        res.status(404).send({"msg":"something getting wrong","error":error.message})
    }
})

module.exports = { restaurantRouter }

