var mongoose    =   require("mongoose");
//mongoose.connect('mongodb://thread:thread123@ds023105.mlab.com:23105/heroku_czld3m55');
//mongoose.connect('mongodb://localhost:27017/thread');
var mongoSchema =   mongoose.Schema;
var userSchema  = {
    "usr_img" : String,
    "email" : String,
    "password" : String,
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
  
   
};
module.exports = mongoose.model('users',userSchema);;
