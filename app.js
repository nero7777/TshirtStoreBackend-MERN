//imports
require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

//Getting routes from routes folder to use below
const authRoutes = require("./routes/auth");

//Connect to database
mongoose.connect(process.env.DATABASE, 
{useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex:true}
).then(() => {
    console.log("DB Connected !!")
});

//creating port so app uses the port
const port = process.env.PORT || 8000;

//For using readymade middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())


//Custom Routes using express router
app.use("/api",authRoutes);




//App listens on port specified
app.listen(port , () => {
    console.log(`App is running at ${port}`)
})