//imports
require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();


//Connect to database
mongoose.connect(process.env.DATABASE, 
{useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex:true}
).then(() => {
    console.log("DB Connected !!")
});

//creating port so app uses the port
const port = process.env.PORT || 8000;







//App listens on port specified
app.listen(port , () => {
    console.log(`App is running at ${port}`)
})