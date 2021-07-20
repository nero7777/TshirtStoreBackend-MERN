const User = require('../models/user')
const {Order} = require('../models/order')

//controller for handling userId param 
//whenever a req has userId param it will set the req.profile object 
//with founduser by id in DB
exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,foundUser) => {
        if(err || !foundUser){
            return res.status(400).json({
                error : "No user found in DB!!"
            })
        }

        req.profile = foundUser;
        next();
    })
}
 
//controller to get a user which is partly done by param handler
exports.getUser = (req,res) => {
    //putting undefined for some properties that are not really needed for user
    //we are just putting undefined in user profile not in database
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    //returning the modified profile of user
    return res.json(req.profile)
}

//controller to get all user in DB
exports.getAllUsers = (req,res) => {
    User.find().exec((err,foundUserList) => {
        if(err || !foundUserList){
            return res.status(422).json({
                error : "cannot get users from DB!!"
            })
        }
        return res.json(foundUserList)
    })
}

//controller to update  user in DB
exports.updateUser = (req,res) => {

    //getting the user by id fetched from getuserbyid
    //from profile field
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,updatedUser) => {
            if(err){
                return res.status(400).json({
                    error : "Unable to update the user!!"
                })
            }
            
            //if user updated successfully the updating the confidential info
            //and only sending the less confidential info and the updated props
            //to the user in frontend
            updatedUser.salt = undefined;
            updatedUser.encry_password = undefined;
            return res.json(updatedUser)
        }
    )
}

//controller to update userpurchaselist in DB
exports.userPurchaseList = (req,res) => {
    Order.find({user : req.profile._id})
    .populate("user","_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error : "No order in this Account!!"
            })
        }
        return res.json(order)
    })
}

//updating the users purchase list by getting data to push in purchase list
exports.pushOrderInPurchaseList = (req,res,next) => {

    let localpurchases = []
    
    req.body.order.products.forEach(product => {
        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            ammount : req.body.order.ammount,
            transaction_id : req.body.order.transaction_id
        })
    }) 

    //Store this in DB
    User.findOneAndUpdate(
        {_id : req.profile._id},
        {$push : {purchases : localpurchases}},
        {new : true},
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error : "Unable to save the purchases !!"
                })
            }
            next();
        }
    )
};