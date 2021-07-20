const User = require("../models/user");
const {check , validationResult} = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt')
const { v4: uuidv4 } = require('uuid');

//signup controller to create user and save him in database---------------------
exports.signup = (req,res) => {
    //checking for the validation results from express validator
    //if all the information is in correct form or not
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    //if everything is in correct and required form 
    //we save the user in DB
    const user = new User(req.body)
    user.save((err,savedUser) => {
        if(err){
            console.log(err)
            return res.status(400).json({
                error : "usnable to save User in DB !!"
            })
        }

        return res.status(200).json(savedUser);

    });
}

//signin controller to authenticate user and signin him in app---------------------
exports.signin = (req,res) => {
    
    //destructuring the req body to extract the email and password 
    const {email,password} = req.body;

    //checking for the validation results from express validator
    //if all the information is in correct form or not
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    //if everything is in correct and required form 
    //we signin the user in 

    User.findOne({email},(err,foundUser) => {

        if(err || !foundUser){
            return res.status(422).json({
                error : "user email does not exist !!"
            })
        }
        
        if(!foundUser.authenticate(password)){
            return res.status(422).json({
                error : "email and password do not match !!"
            })
        }   

        //if found user without any error and also authenticated
        //so now we sign in the user and create token
        //and sign it using id and secret
        var token = jwt.sign({_id:foundUser._id},process.env.SECRET)

        //and now putting the token in cookie so the
        //cookie can be stored in localstorage of user
        res.cookie("token",token,{expire : new Date() + 9999})

        //sending the response to frontend
        const {_id,name,email,role} = foundUser;
        return res.json({
            token,
            user:{_id,name,email,role}
        })

    })

}

//signout controller to delete user token and cookie-------------------------
exports.signout = (req,res) => {
    res.clearCookie("token");
    return res.json({
        message : "user signout successful !!"
    })
}

//custom middlewares for protecting routes---------------------------------
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
});

exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED !!"
        })
    }

    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "Your are not an ADMIN , ACCESS DENIED!!"
        })
    }
    next();
}