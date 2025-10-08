const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const {Schema} = mongo;

const usersSchema = new Schema({
    fullname : String,
    mobile : String,
    email : {
        type : String,
        unique : true
    },
    password : String,
    profile : String,
    address : String,
    userType : String,
    isActive : {
        type : Boolean,
        default : false
    }
},{timestamps : true});

// mongoose middleware for encryption
usersSchema.pre("save" , async function(next){
    const user = this;
    if(!user.isModified("password")) return next();   //if password is already encrypted then do nothing just execute next
    const salt = await bcrypt.genSalt(10);    //Salt gives different encrypted password for every different password
    user.password = await bcrypt.hash(user.password , salt);
});

module.exports = mongo.model("user" , usersSchema);     //Data is saved in this line in the mongodb database