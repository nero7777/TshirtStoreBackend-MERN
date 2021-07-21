const express = require('express');
const router = express.Router();
const {isSignedIn,isAdmin,isAuthenticated} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');
const {getCategoryById,createCategory,getCategory,getCategories,updateCategory,deleteCategory} = require('../controllers/category');

//route parameters
router.param("userId",getUserById);
router.param("categoryId",getCategoryById);

//route for categories
router.get("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,getCategory);
router.get("/categories",getCategories)

router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);

router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory);

router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteCategory);









module.exports = router;