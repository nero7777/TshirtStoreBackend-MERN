const Product  = require("../models/product");
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs')

//middleware that finds the product by id and populates the req.product fields
exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,foundProduct) => {
        if(err){
            return res.status(400).json({
                error : "unable to get product from DB!!"
            })
        }
        req.product = foundProduct;
        next();
    })
}

//controller to create a product
exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image!!"
            })
        }

        //destructuring the fields
        const {name,description,price,category,stock} = fields;

        if( !name || !description || !price || !category || !stock ){
            return res.status(400).json({
                error : "please include all fields!!"
            })
        }
        
        //Todo : restrictions on fields
        let product = new Product(fields)

        //handling the file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "file size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        //saving the product in DB
        product.save((err,savedProduct) => {
            if(err){
                return res.status(400).json({
                    error : "unable to save product in DB!!"
                })
            }
            return res.json(savedProduct);
        })
    })

}

//controller to get product
exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

//middleware to parse image
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)

    }
    next();
}

//controller to update product
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image!!"
            })
        }
        
        //updation code 
        let product = new Product(fields)
        product = _.extend(product,fields)

        //handling the file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "file size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        //saving the product in DB
        product.save((err,updatedProduct) => {
            if(err){
                return res.status(400).json({
                    error : "unable to update product in DB!!"
                })
            }
            return res.json(updatedProduct);
        })
    })
}

//controller to delete product
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error : "Failed to delete product"
            })
        }
        return res.json({
           message : `${deletedProduct} deleted Successfully!!`
        })
    })
}

//controller to read all products
exports.getProducts = (req,res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 8;  
    
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,foundProducts) => {
        if(err){
            return res.status(400).json({
                error : 'no product found in DB!!'
            })
        }
        res.json(foundProducts)
    })
}

//
exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,category) => {
        if(err){
            return res.status(400).json({
                error : "no category found in DB!!"
            })
        }
        return res.json(category);
    })
}

//middlewares for product stock inventory
exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod => {
       return {
           updateOne : {
               filter: {_id : prod._id},
               update : {$inc: {stock: -prod.count,sold: +prod.count}}
           }
       }
    })

    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error : "Bulk operations failed !!"
            })
        }
        next()
    })
}