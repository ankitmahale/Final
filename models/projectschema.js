var mongoose    =   require("mongoose");
var mongoSchema =   mongoose.Schema;
var projectSchema  = {
    "proj_name" : String,
    "proj_created" : String,
    "proj_updated" : String,
	"proj_posts" : [
	{
      		"post_media" : [
      		{
      			"post_media_url" : String,
      			//"post_media_type" : String
      		}
      		],
      		"post_likes" : [{
      			"post_usr_like_id" : String
      		}],
      		"post_story" : String,
      		"post_created" : Date,
      		"post_tags" : [{
      		
      		      "usr_id" : String
      		}],
      		"post_usr_id" : String,
      		
      		"post_comments" : [
      		{
      			"post_usr_id" : String,
      			"post_comment" : String
    		}
    ]
    }],  
    "proj_desc" : String,
    "proj_category" : String,
    "proj_team_members" : [
    {
    	"proj_usr_id" : String
    }
    ],
    "proj_cover_img" : String,
    "proj_privacy" : String
};
module.exports = mongoose.model('projects',projectSchema);;
/*

db.try.find(
   { "results.score" : {$gte : 8}}, { "results.$" : 1,"_id" : 0}
)


db.try.aggregate(
    { $match: {}},
    { $unwind: '$results'},
    { $match: {'results.score': {$gt: 6}}},
    { $group: {_id: '$_id', results: {$push: '$results'}}},
    { $sort : { 'results.score' : -1 } }
    
    )

db.date.aggregate(
    { $match: {}},
    { $unwind: '$proj_posts'},
    { $match: {'proj_posts.dateAdded': {$gte: ISODate('2016-01-21T14:56:59.301Z') , $lte: ISODate('2016-01-30T14:56:59.301Z')}}},
    { $group: {_id: '$_id',"proj_name": "$proj_name" proj_posts: {$push: '$proj_posts'}}},
    { $sort : { 'proj_posts.dateAdded' : -1 } }
    
    )


*/
