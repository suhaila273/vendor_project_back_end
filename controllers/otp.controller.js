const userModel = require("../Models/userModel");
const otpService=require("../services/otp.service");

exports.otpReset=async (req,res,next)=>{
    const{email}=req.body
    let data=await userModel.findOne({"email":email})
    if(!data)
    {
        return res.status(404).send({
            message:"Email not registered",
            
        })
    }

    else{
        otpService.sendOTP(req.body,(error,results)=>{
            if(error){
                return res.status(400).send({
                    message: "error",
                    data: error,
                });
            }
            return res.status(200).send({
                message: "Success",
                data: results,
            });
        });
    }
};

exports.verifyOTP=(req,res,next)=>{
    otpService.verifyOTP(req.body,(error,results)=>{
        if(error){
            return res.status(400).send({
                message: "error",
                data: error,
            });
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};