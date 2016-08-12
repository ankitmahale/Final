var mongoose    =   require("mongoose");
var mongoSchema =   mongoose.Schema;
var schoolSchema  = {
      "sch_name" : String,
      "sch_state" : String,
       "sch_country": String,
       "sch_city" : String,
       "sch_usr" : [{
			
            "usr_id" : String
            
       }],
       "sch_proj" : [{
			
    		"proj_id" : String,
    		
       }],
       "sch_img" : String
    
};

module.exports = mongoose.model('schools',schoolSchema);;