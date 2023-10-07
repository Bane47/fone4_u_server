const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/router");
const crud = require('./routes/phoneDetails')
const feedback = require('./routes/feedback')
const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect("mongodb://127.0.0.1:27017/Fone4U");

app.use('/',routes);
app.use('/',crud);
app.use('/',feedback);  

app.listen(3001, () => {
    console.log("Server is running");
})