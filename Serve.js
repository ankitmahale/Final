var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var obj_users     =   require("./models/usersschema");
var obj_project    =   require("./models/projectschema");
var fs = require('fs');
//var obj_school = require("./models/schoolSchema");
var router      =   express.Router();
var dt = new Date().toUTCString()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));


var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database


require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
/////
app.get('/s3Proxy', function(req, res, next){
    // download the file via aws s3 here
    var fileKey = req.query['fileKey'];
    console.log(fileKey);

    console.log('Trying to download file', fileKey);
    var AWS = require('aws-sdk');
    AWS.config.update(
      {
        accessKeyId: "AKIAJFU3O6NA5VPKUVFQ",
        secretAccessKey: "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",
        region: 'us-east-1'
      }
    );
    var s3 = new AWS.S3();
    var options = {
        Bucket    : '/metaphor.thread',
        Key    : fileKey,
    };

    res.attachment(fileKey);
    var fileStream = s3.getObject(options).createReadStream();
    fileStream.pipe(res);
});

/////
   app.get('/uniqueusername',function(req,res){
       var response = {};
       if(req.query.usr_username==null || req.query.usr_username=="")
       {
           response= {"status" : false, "message" : "Username cannot be null"}
           res.json(response);
       }
       obj_users.find({"usr_username": req.query.usr_username},{"usr_username":1},function(err,data){
        if(err) {
                response = {"status" : false,"message" : "Error fetching Username"};
            } else {
                response = {"status" : true, "message" : data};
            }
       res.json(response);
       });
   })
 
 
   
   
   app.get("/uniqueemail",function(req,res){
       var response = {};
       if(req.query.email==null || req.query.email=="")
       {
           response= {"status" : false, "message" : "Email cannot be null"}
           res.json(response);
       }
       obj_users.find({"email": req.query.email},{"email":1},function(err,data){

        if(err) {
                response = {"status" : false,"message" : "Error fetching email"};
            } else {
                response = {"status" : true, "message" : data};
            }
       
       
       res.json(response);
       });
   })


  
   app.get("/userdetails",function(req,res){
       var response = {};
       if(req.query.usr_id==null || req.query.usr_id=="")
       {
           response= {"status" : false, "message" : "User id cannot be null"}
           res.json(response);
       }
       obj_users.find({"_id" : req.query.usr_id},{usr_projs:1},function(err,data){
         if(err) {
                response = {"status" : false,"message" : "Error Fetching data"};
            } else {
                response = {"status" : true, "usr_projs" : data[0].usr_projs};
            }   
               
          
           res.json(response);
       });
   })
   
   app.get("/usrdetails",function(req,res){
       var response = {};
       if(req.query.usr_id==null || req.query.usr_id=="")
       {
           response= {"status" : false, "message" : "User id cannot be null"}
           res.json(response);
       }
       obj_users.find({"_id" : req.query.usr_id},{usr_projs:0},function(err,data){
         if(err) {
                response = {"status" : false,"message" : "Error Fetching data"};
            } else {
                response = {"status" : true, "message" : data};
            }   
               
          
           res.json(response);
       });
   })
   
   /*
   app.get("/feeds",function(req,res){
       var response = {};
    var db = new obj_project();
   //obj_project.find({},{"sort" : [['proj_post', 'asc']]},{"proj_name" : 1}, function (err, docs) { 
   db.find.sort({"proj_created" : 1}, function (err, docs) { 
   
   response={"status" : docs};
   res.json(response);
})
     
  }) 
  
   */
   
   
  
   
   
   
   
   
   
   
   
   
   
   app.put('/updateuserdetails',function(req,res){
        var response = {};
        obj_users.findById(req.body.usr_id,function(err,data){
            if(err) {
                response = {"status" : false,"message" : "Error fetching the user id"};
            } else {
                
                data.email = req.body.usr_email;
                
                data.usr_fname = req.body.usr_fname;
       		    data.usr_lname = req.body.usr_lname;
                data.usr_img = req.body.usr_img;
                data.usr_username = req.body.usr_username;
                data.usr_passion = req.body.usr_passion;
                
                
                data.save(function(err){
                    if(err) {
                        response = {"status" : false,"message" : "Error updating data"};
                    } else {
                        response = {"status" : true, "message" : "Data is updated for "+req.body.id};
                    }
                    res.json(response);
                })
            }
        });
    })


        app.delete('/deleteuser',function(req,res){
        var response = {};
       
        obj_users.find({"_id": req.query.usr_id },function(err,data){
        if(err) {
                response = {"status" : false,"message" : "Error deleting user!"};
            }
         if(data==null) {
                response = {"status" : false,"message" : "User not found!"};
            }   
        if(!err && data!=null)
        {
              response={response , "status" : true ,"message" : "statusfully deleted!"};
        }    
        res.json(response);
        
        }).remove().exec();
    })
    /*
    
    db.trial.find(
   { proj_posts: { $elemMatch: { dataAdded: { $gte: ISODate("2015-08-01T00:00:00.000Z") } } } }
).sort({"proj_posts.dataAdded" : -1})
    
    
    */
   
     app.post('/addproject', function(req,res){
        var db = new obj_project();    
        var response = {};
        db.proj_name = req.body.proj_name;
        db.proj_created = new Date().toUTCString();
        db.proj_desc = req.body.proj_desc;
        db.proj_category = req.body.proj_category;
        db.proj_team_members = req.body.proj_team_members;
        db.proj_cover_img = req.body.proj_cover_img;
        db.proj_privacy = req.body.proj_privacy;
        db.proj_posts= req.body.proj_posts;
        db.proj_updated = new Date().toUTCString();
       	
        db.save(function(err,val){
            if(err) {
                response = {"status" : false,"message" : "Error adding data"};
            } else {
                response = {"status" : true,"message" : val._id};
            }
            
            res.json(response);
        });
  
})    
        
        app.get("/projectdetails",function(req,res){
       var response = {};
       obj_project.find({"_id": req.query.proj_id},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error adding data"};
            } else {
                response = {"status" : true, "message" : data[0]};
            }
       
       res.json(response);
       });
    })
    
       
     
      app.put('/updateprojectdetails',function(req,res){
        var response = {};
        obj_project.findById(req.query.proj_id,function(err,data){
            if(err) {
                response = {"status" : false,"message" : "Error finding the project id"};
            } else {
                
                data.proj_name = req.body.proj_name;
                data.proj_desc = req.body.proj_desc;
       		    data.proj_category = req.body.proj_category;
                data.proj_cover_img = req.body.proj_cover_img;
                data.proj_privacy= req.body.proj_privacy;
                data.proj_team_members = req.body.proj_team_members;
                data.proj_updated= new Date().toUTCString();
                
                
                data.save(function(err){
                    if(err) {
                        response = {"status" : false,"message" : "Error updating project data"};
                    } else {
                        response = {"status" : true, "message" : "Project Data is updated for "+ req.query.proj_id};
                    }
                    res.json(response);
                })
            }
        });
    })
    
    
    app.delete('/deleteproject',function(req,res){
        var response = {};
       
        obj_project.findById({"_id": req.body.proj_id},function(err,data){
        if(err) {
                response = {"status" : false,"message" : "Error deleting project!"};
            }
       /*  if(Buffer.byteLength(data, 'utf8')==0) {
                response = {"status" : false,"message" : "Project not found!"};
            }   */
        if(!err && data!=null)
        {
        	console.log(res);
              response={response , "status" : true ,"message" : "successfully deleted!"};
        }    
        res.json(response);
        
        }).remove().exec();
    })
      
 ////////////     
 /*app.delete('/projdel', function(req, res, next) {
  obj_project.findById(req.params.proj_id, function (err, article) {
    if(err) { return next(err); }
    if(!article) { return res.send(404); }
    else{
    article.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });}
  });
});*/


app.delete('/projdel', function (req, res) {
    obj_project.findById({"_id" : req.params.proj_id})
        .exec(function(err, doc) {
            if (err || !doc) {
                res.statusCode = 404;
                res.send({});
            } else {
                doc.remove(function(err) {
                    if (err) {
                        res.statusCode = 403;
                        res.send(err);
                    } else {
                        res.send({});
                    }
                });
            }
        });
});
 



  /////////    
    
    
    app.put("/addteammembers",function(req,res){
       var response = {};
     
       obj_project.update(
       {"_id" : req.body.proj_id},{$push:{"proj_team_members":
        {
            "proj_usr_id" : req.body.proj_usr_id
        }
    }},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error updating team members"};
            } else {
                response = {"status" : true, "message" : data};
             
            }
       
       res.json(response);
       });
    }) 
    
     app.put("/deleteteammembers",function(req,res){
       var response = {};
     
       obj_project.update(
       {"_id" : req.body.proj_id},{$pull:{"proj_team_members":
        {
            "proj_usr_id" : req.body.proj_usr_id
        }
    }},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error updating team members"};
            } else {
                
                
                response = {"status" : true, "message" : data};
                
                
            }
       
       res.json(response);
       });
    }) 
    
    
    app.put("/addprojectinuser",function(req,res){
       var response = {};
     
       obj_users.update(
       {"_id" : req.body.usr_id},{$push:{"usr_projs":
        {
            "proj_id" : req.body.proj_id
        }
    }},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error updating team members"};
            } else {
                
                
                response = {"status" : true, "message" : data};
                
                
            }
       
       res.json(response);
       });
    })
    
    app.put("/deleteprojectfromuser",function(req,res){
       var response = {};
     
       obj_users.update(
       {"_id" : req.body.usr_id},{$pull:{"usr_projs":
        {
            "proj_id" : req.body.proj_id
        }
    }},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error updating team members"};
            } else {
                
                
                response = {"status" : true, "message" : data};
                
                
            }
       
       res.json(response);
       });
    })

    
    app.put("/addpost",function(req,res){
       var response = {};
     
       obj_project.update(
       {"_id" : req.body.proj_id},{"proj_updated" : new Date().toUTCString(), $push:{
       
       "proj_posts":
        {
            "post_media" : req.body.post_media,
            "post_likes" : req.body.post_likes,
            "post_story" : req.body.post_story,
            "post_created" : new Date().toUTCString(),
            "post_tags" : req.body.post_tags,
            "post_usr_id" : req.body.post_usr_id,
            "post_comments" : req.body.post_comments
          
        }
    }},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error adding post"};
            } else {
                response = {"status" : true, "message" : console.log(req)};
            
            }
       
       res.json(response);
       });
    })
    
    
      app.get("/postdetails",function(req,res){
       var response = {};
       obj_project.find({"_id": req.query.proj_id},{"proj_posts" : 1},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error fetching data"};
            } else {
                response = {"status" : true, "proj_posts" : data[0].proj_posts};
            }
       
       res.json(response);
       });
    })
    
    
    app.put("/deletepost",function(req,res){
       var response = {};
     
       obj_project.update(
       {"_id" : req.body.proj_id},{$pull:{"proj_posts":
        {
            "_id" : req.body.post_id
        }
    }},function(err,data){
       
       if(err) {
                response = {"status" : false,"message" : "Error updating team members"};
            } else {
                
                
                response = {"status" : true, "message" : data};
                
            }
       
       res.json(response);
       });
    })
    
    
    
      
   app.get("/autopredictname",function(req,res){
       var response = {};
       //obj_users.find({usr_username: { $regex: '\^a.*$' }},function(err,data){
      obj_users.find({ $or : [{usr_username: { $regex:'\^'+req.query.name+'.*$'}} , {email : {$regex: '\^'+req.query.name+'.*$' }} ] },{email:1,usr_username:1},function(err,data){
       if(err) {
                response = {"status" : false,"message" : "Error fetching data"};
            } else {
                response = {"status" : true,"message" : data};
            }
            
       res.json(response);
       });
   })
    
    
    app.get("/feeds",function(req,res){
      var response = {};
      var isodate = new Date().toISOString()
      console.log(isodate);
      var year=req.query.year;
      var month=req.query.month;
      if(month.length<2) month="0"+month;
      var day=req.query.day;
      if(day.length<2) day="0"+day;
      var hour=req.query.hour;
      if(hour.length<2) hour="0"+hour;
      var min=req.query.min;
      if(min.length<2) min="0"+min;
      var sec=req.query.sec;
      if(sec.length<2) sec="0"+sec;
      var dateString= year+"-"+month+"-"+day+"T"+hour+":"+min+":"+sec+".000Z";
      console.log(dateString);
      obj_project.aggregate(  
      
    { $match: {}},
    { $unwind: '$proj_posts'},
    { $match: {'proj_posts.post_created': {$gte: new Date(dateString) , $lte: new Date(isodate)}}},
    { $group: {_id: '$_id',proj_name: { "$first": "$proj_name" }, proj_posts: {$push: '$proj_posts'}}},
   
    
    
    
    function(err, summary) {
        
        response={"data" : summary}
        res.json(response);
    }
);
      
    
    })
    




















/*
	router.route("/addusrinsch")
     .post(function(req,res){
	var db1 = new obj_school();
      var response = {};
      console.log("in ogher",usr_id)
        db1.sch_usr =[{"usr_id" : usr_id}];
       db1.save(function(err){
       
        if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added in school"+ usr_id};
            }
            res.json(response);
  
});


}) 





   router.route("/login")
   .get(function(req,res){
       var response = {};
       obj_users.find({"email":req.query.email,"password":req.query.password},{fname:1,lname:1,projects:1,_id:1},function(err,data){
        response = data;
           res.json(response);
       });
   })

    
    
    router.route("/accessprojects")
   .get(function(req,res){
       var response = {};
       obj_users.find({ "_id": req.query.id}, {'projects.project_id':1,'projects.pro_name' : 1,'projects.pro_desc':1,'projects.pro_cover_img' : 1,'projects.pro_created':1},function(err,data){
           if(err) {
               response = {"error" : true,"message" : "Error fetching data"};
           } else {
               response = {data};
           }
           res.json(response);
       });
   })
    
    router.route("/adduserdinschool")
    .post(function(req,res){
         var db = new obj_school(); 
         var response ={};
         db.sch_name=req.body.sch_name;
         db.sch_state=req.body.sch_state;
         db.sch_country=req.body.sch_country;
         db.sch_city=req.body.sch_city;
         
         db.save(function(err){
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"+ req.body.sch_name};
            }
            res.json(response);
        });
         
         
         
         
    });
    
    
    
    
  
   router.route("/projects")
    .get(function(req,res){
        var response = {};
        obj_project.find({},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
  
    
    
    .post(function(req,res){
        var db = new obj_project();
        var response = {};
        db.pname = req.body.pname;
        db.created = req.body.created;
        
        db.posts= null;
        db.description= req.body.description;
        db.rating= req.body.rating;
        db.category=req.body.category;
        
        db.save(function(err){
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"+req.body.team_members};
            }
            res.json(response);
        });
    });
    
   
    //////////
    
    db.projects.aggregate(
    { $match: {}},
    { $unwind: '$proj_posts'},
    { $match: {'proj_posts.post_created': {$gte: ISODate('2016-08-01T14:56:59.301Z') , $lte: ISODate('2016-08-30T14:56:59.301Z')}}},
    { $group: {_id: '$_id', proj_posts: {$push: '$proj_posts'}}},
    { $sort : { 'proj_posts.post_created' : -1 } }
    
    )
    
    
    
    
    
    /////////
    
    
    
    
    
    
    
    
    
    
    
    

router.route("/login")
    .get(function(req,res){
        var response = {};
        obj_users.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .put(function(req,res){
        var response = {};
        obj_users.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                if(req.body.userEmail !== undefined) {
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    data.userPassword = req.body.userPassword;
                }
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    .delete(function(req,res){
        var response = {};
        obj_users.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                obj_users.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })
    
*/    

//app.use('/',router);


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
console.log("Listening to PORT 3000");
