const express=require("express")

const router=express.Router()
const userModel=require("../Models/userModel")

const bcrypt=require("bcryptjs")

//to list all vendors
router.get("/viewallusers",async(req,res)=>{
    let result=await userModel.find()
    res.json(result)
})

//encoding technique for paasword
hashPasswordGenerator=async(pass)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

//signup of vendors
router.post("/signup",async(req,res)=>{
    let {data}={"data":req.body}
    let password=req.body.password

    const hashedPassword=await hashPasswordGenerator(password)
    data.password=hashedPassword
    let signup=new userModel(data)
    let result=await signup.save()
    res.json({
        status:"success"
    })
})

//login of vendors

router.post("/login",async(req,res)=>{
    let input=req.body
    let email=req.body.email
    let data=await userModel.findOne({"email":email})
    if(!data){
        return res.json(
            {
                status:"invalid email id"
            }
        )
    }
    console.log(data)
    let dbPassword=data.password
    let inputPassword=req.body.password
    console.log(dbPassword)
    console.log(inputPassword)
    const match=await bcrypt.compare(inputPassword,dbPassword)
    if(!match)
    {
        return res.json(
            {
                status : "incorrect password"
            }
        )
    }
    res.json({
        status : "success","userdata":data
    })
})


module.exports=router