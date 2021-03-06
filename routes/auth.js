const express = require('express');
const router = express.Router();
const {signout,signup,signin, isSignedIn} = require('../controllers/auth');
const {check} = require('express-validator');

//To create user in DB
router.post("/signup",[
    check("name","Minimum size of name must be 3 letters").isLength({min:3}),
    check("email","Email must be specified").isEmail(),
    check("password","password must be atleast 3 charecter").isLength({min : 3}),
],signup);

//To login the user who is already been created in DB
router.post("/signin",[
    check("email","Email must be specified").isEmail(),
    check("password","Minimum length of password must be 3 letter").isLength({min : 3})
],signin);

//To sign out the signed in user
router.get("/signout",isSignedIn,signout)

module.exports = router;