const {Order} = require('../models/order');
const User = require('../models/user')

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,foundOrder) => {
        if(err){
            return res.status(400).json({
                error : "No Order found !!"
            })
        }
        req.order = foundOrder;
        next();
    })
}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,savedOrder) => {
        if(err){
            return res.status(400).json({
                error : "unable to save order in DB!!"
            })
        }
        res.json(savedOrder);
    })
}

exports.getAllOrders = (req,res) => {
    Order
    .find()
    .populate("user","_id name")
    .exec((err,foundOrders) => {
        if(err){
            return res.status(400).json({
                error : "Found NO orders!!"
            })
        }
        return res.json(foundOrders);
    })
}

exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req,res) => {
    Order.update(
        {_id : req.body.order._id},
        {$set : {status : req.body.status}},
        (err,order) => {
            if(err){
                return res.status(400).json({
                    error : "cannot update order status!!"
                })
            }
            return res.json(order)
        }
    )
}