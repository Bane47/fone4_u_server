const mongoose = require('mongoose');

const phonesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Makes the 'name' field required
    },
    processor: {
        type: String,
        required: true,
    },
    ram: {
        type: String,
        required: true,
    },
    battery: {
        type: String,
        required: true,
    },
    camera: {
        type: String,
        required: true,
    },
    storage: {
        type: String,
        required: true,
    },
    display: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Ensures that the 'price' is a non-negative number
    },
    image:{
        type:String,
        required:true
    }
});

const phonesModel = mongoose.model("phones", phonesSchema);
module.exports = phonesModel;
