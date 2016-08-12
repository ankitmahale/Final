// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema(
{

    
    "email" : String,
    "password" : String,
    "usr_img" : String,
    "usr_fname" : String,
    "usr_lname" : String,
    "usr_username" : String,
    "usr_dob" : String,
    "usr_created" : String,
    "usr_passion" : [],
    "usr_projs" : [
    {
    		"proj_id" : String
    		
    }],
    "usr_school" : [{
            "sch_id" : String,
            "sch_type" : String,
            "sch_grad_date" : String
    
    }],
  
   
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
