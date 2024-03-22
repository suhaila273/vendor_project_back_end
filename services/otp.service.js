const optGenerator=require("otp-generator");
const crypto=require("crypto");
const key= "test123";
const emailServices=require("../services/emailer.service");

async function sendOTP(params, callback){
    const otp=optGenerator.generate(
        4,{
            digits: true,
            upperCaseAlphabets:false,
            specialChars: false,
            lowerCaseAlphabets: false,
        }
    );
    const ttl=5*60*1000; //5 min
    const expires=Date.now()+ttl;
    const data=`${params.email}.${otp}.${expires}`;
    const hash=crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash= `${hash}.${expires}`;

    var optMessage= `Dear Customer, ${otp} is the one time password to reset your password`;

    var model={
        email: params.email,
        subject: "reset password OTP",
        body: optMessage
    };

    emailServices.sendEmail(model,(error,result)=>{
        if(error)
        {
            return callback(error);
        }
        return callback(null,fullHash);
    });

}

async function verifyOTP(params, callback){
    let [hashValue, expires] = params.hash.split('.');

    let now=Date.now();

    if(now > parseInt(expires)) return callback("OTP expired");

    let data=`${params.email}.${params.otp}.${expires}`;

    let newCalculatedHash=crypto.createHmac("sha256",key).update(data).digest("hex");
    if(newCalculatedHash == hashValue){
        return callback(null,"Success");
    }

    return callback("Invalid OTP");


}
module.exports={
    sendOTP,
    verifyOTP
}