const Category = require("../models/category")

//route to get category by id and populate or create a category in req 
//so the req.category can be used by further req's
exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,foundCategory) => {
        if(err){
            return res.status(200).json({
                error : "unable to find category in DB !!"
            })
        }

        req.category = foundCategory;
        next();
    })
}

//route to create a category
exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,createdCategory) => {
        if(err){
            return res.status(400).json({
                error : "unable to save category in DB !!"
            })
        }
        return res.json(createdCategory);
    })
}
    
//route to get a single category by using id
exports.getCategory = (req,res) => {
    res.json(req.category)
}
    
//route to get all categories
exports.getCategories = (req,res) => {
    Category.find({},(err,foundCategories) => {
        if(err){
            return res.status(400).json({
                error : "Not able to get categories from DB !!"
            })
        }
        return res.json(foundCategories);
    })
}

//route to update category
exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err,updatedCategory) => {
        if(err){
            return res.status(400).json({
                error : "Unable to update category !!"
            })
        }
        return res.json(updatedCategory);
    })
}

//route to update category
exports.deleteCategory = (req,res) => {
    const category = req.category;
    category.remove((err,deletedCategory) => {
        if(err){
            return res.status(400).json({
                error : "unable to delete Category!!"
            })
        }
        return res.json({
            message : `${deletedCategory} deleted Successfully`
        })
    })
}
