const express = require('express');
const router = express.Router();
const {getProductById,createProduct,getProduct, photo,updateProduct,deleteProduct,getProducts,getAllUniqueCategories} = require('../controllers/product');
const {isSignedIn,isAdmin,isAuthenticated} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');


//route parameters
router.param("userId",getUserById);
router.param("productId",getProductById);

//routes for products
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);

router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);


router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);

router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);

router.get("/products",getProducts);
router.get("/products/categories",getAllUniqueCategories);









module.exports = router;