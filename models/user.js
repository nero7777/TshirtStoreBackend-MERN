const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
 
//Writing userSchema or structuring the user model to store data in database
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true
    },
    lastname:{
        type:String,
        maxlength:32,
        trim:true
    },
    userInfo:{
        type:String,
        maxlength:100,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    encry_password:{
        type:String,
        require:true
    },
    salt : String,
    role:{
        //0 -> Normal User
        //1 -> Admin
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    }
},{timestamps : true});

//Setting up a virtual field for password to 
//directly encrypt it and store in database
userSchema.virtual("password")
.set(function(password){
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
})
.get(function(){
    return this._password;
})

//setting up schema methods for authentication and encryption
userSchema.methods = {

    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },
    securePassword : function(plainpassword){
            if(!plainpassword) return "";   
            try{
                return crypto.createHmac('sha256', this.salt)
                .update(plainpassword)
                .digest('hex')
            }catch(err){
                return "";
            }
    }
}

//Whenever u want to create or store a user refer to this model as "User"
module.exports = mongoose.model("User",userSchema);