const mongoose=require('mongoose')

 const messageSchema=mongoose.Schema({
    message:{
        type:String
    },
    email:{
        type:String,
        required:true
    }
 })

 const messageModel=mongoose.model("Feedbacks",messageSchema)

 module.exports=messageModel;