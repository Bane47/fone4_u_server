const nodemailer = require('nodemailer');
const accountsModel = require('../models/users');

const emailSender= async (email,password,id)=>{

    try{    
    const user = await accountsModel.findOne({email:email})

        if(!user){
            res.status(404).json({error:"User not defined"});
            return;
        }
        const token = jwt.sign({id:user._id},"jwt_secret_key",{
            expiresIn:"1d"
        });


        
        const updateUser = await accountsModel.findByIdAndUpdate(id,{password:password},{new:true});
        
        if(!updatUser){
            res.status(404).json({error:"User not found"});
            return;
        }

        res.json(updateUser);

    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'priyadarshanmanoharan@gmail.com',
            pass:"ruos jrry mhar hphm"
        }
    });
    
    var mailOptions = {
        from:'priyadarshanmanoharan@gmail.com',
        to:email,
        subject:"Here is your password reset link",
        text:``
    }
    
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
            console.log("No user found")
        }else{
            console.log("Email sent: "+info.response);
        } 
    })

}catch(error){
    console.error(error)
}

}



module.exports=emailSender;