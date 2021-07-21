const express = require('express');
const router = express.Router();
const {isSignedIn,isAdmin,isAuthenticated} = require('../controllers/auth')
const {getUserById,getUser,getAllUsers,updateUser,deleteUser,userPurchaseList} = require('../controllers/user')

//user params to get userbyid called only once although 
//param may appear many times in different routes
router.param("userId",getUserById);

//user routes
router.get("/user/:userId",isSignedIn,isAuthenticated,getUser);
router.get("/users",getAllUsers)
router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList)

router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)



module.exports = router;