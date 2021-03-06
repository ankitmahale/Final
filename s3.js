var express = require('express');
var app = express();
var fs = require('fs');

app.get('/', function(req, res, next){
    res.send('You did not say the magic word');
});


app.get('/s3Proxy', function(req, res, next){
    // download the file via aws s3 here
    var fileKey = req.query['fileKey'];
    console.log(fileKey);

    console.log('Trying to download file', fileKey);
    var AWS = require('aws-sdk');
    AWS.config.update(
      {
        accessKeyId: "",
        secretAccessKey: "",
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

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('S3 Proxy app listening at http://%s:%s', host, port);
});
