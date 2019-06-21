// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express

const MongoClient = require('mongodb').MongoClient;

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var mongoConnectUrl = 'mongodb+srv://admin:admin@cluster007-swmbf.mongodb.net/test?retryWrites=true&w=majority';
var port = process.env.PORT || 8080;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/add-quiz', function(req, res) {
    MongoClient.connect(mongoConnectUrl, { useNewUrlParser: true }, (err, client) => {
        if (err) return console.log(err)
        var dbo = client.db("openquiz_dev");
        dbo.collection("quiz").insertOne(req.body, function(err, res) {
            if (err) throw err;
            client.close();
        });
    })
    return res.sendStatus(200);
});

app.post('/get-quiz', function(req, res) {
    MongoClient.connect(mongoConnectUrl, { useNewUrlParser: true }, (err, client) => {
        if (err) return console.log(err)
        var dbo = client.db("openquiz_dev");
        dbo.collection("quiz").findOne({name: req.body.name}, (err, item) => {
            res.json(item);
        });
    })
});

app.get('/get-all-quizzes', function(req, res) {
    MongoClient.connect(mongoConnectUrl, { useNewUrlParser: true }, (err, client) => {
        if (err) return console.log(err)
        var dbo = client.db("openquiz_dev");
        dbo.collection("quiz").find({}).toArray(function(err, result) {
            res.json(result);
        });
    })
});

app.listen(port);
console.log('Listening on port ' + port);
