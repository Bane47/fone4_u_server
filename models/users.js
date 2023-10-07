const mongoose = require('mongoose');

//creating a schema
const accountSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim:true,
        lowercase:true,
        match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        minlength:6
    },
    phone: {
        type: Number,
        required: true,
        validate:{
            validator:function (value){
                return /^\d{10}$/.test(value);
            },
            message:'Invalid phone number format'
        }
    },
    role:{
        type:String,
        required:true      
    },
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/522855255/vector/male-profile-flat-blue-simple-icon-with-long-shadow.jpg?s=612x612&w=0&k=20&c=EQa9pV1fZEGfGCW_aEK5X_Gyob8YuRcOYCYZeuBzztM="
    }

});


const accountsModel = mongoose.model("accounts", accountSchema);
module.exports = accountsModel;