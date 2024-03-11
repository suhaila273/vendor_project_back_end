const mongoose=require("mongoose")

const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        companyName:{
            type:String,
            required:true
        },
        companyAddress:{
            type:String,
            required:true
        },
        personName:{
            type:String,
            required:true
        },
        contact:{
            type:String,
            required:true
        }
    }
)

module.exports=mongoose.model("users",userSchema)