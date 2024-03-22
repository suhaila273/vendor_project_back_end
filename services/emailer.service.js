var nodemailer=require('nodemailer');

async function sendEmail(params, callback){

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kyle92@ethereal.email',
            pass: 'n2BS5TqW2ptymXu5jU'
        }
    });

    var mailOptions={
        from: 'tested@gmail.com',
        to: params.email,
        subject: params.subject,
        text: params.body,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return callback(error);
        }
        else{
            return callback(null, info.response);
        }
    });
}

module.exports={
    sendEmail
}