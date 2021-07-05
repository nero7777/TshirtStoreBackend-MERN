const User = require("../models/user");
const {check , validationResult} = require('express-validator');

//signup controller to create user and save him in database
exports.signup = (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err,savedUser) => {
        if(err){
            console.log(err)
            return res.status(400).json({
                error : "Unable to save User in DB !!"
            })
        }

        return res.status(200).json(savedUser);

    });
}

//signin controller to authenticate user and signin him in app
exports.signin = (req,res) => {
    res.json({message : "User Signed Out Successfully !!"})
}

//signout controller to delete user token and cookie
exports.signout = (req,res) => {
    res.json({message : "User Signed Out Successfully !!"})
}