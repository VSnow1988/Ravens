//IMPORT MODULES
var express = require("express"); //Use Express framework
var app = express(); //Setup the app in Express
var bodyParser = require('body-parser'); // to use POST data as JSON objects
var mongoose = require('mongoose'); //work with MONGODB

//SET AND USE MODULES
app.set('views', __dirname + '/views'); // Look in views for your templates
app.set('view engine', 'ejs'); // use .ejs documents with embedded javaScript
app.use(express.static(__dirname + "/static")); // enable accessing of static documents
app.use(bodyParser.urlencoded({extended: true})); // use bodyParser
mongoose.connect('mongodb://localhost/basic_mongoose'); // Use Mongoose

//MODELS
var ravenSchema = new mongoose.Schema({
	name:  { type: String, required: true, minlength: 2}, //these are validations! Throws errors and does not enter data
    favfood: { type: String, required: true, minlength: 2},
    age: { type: Number, min: 0, max: 9999999 },
	}, {timestamps: true})//Create a Schema (model)makes it so we have IDs with timestamps.
mongoose.model('Raven', ravenSchema); // We are setting this Schema in our Models as 'Raven'
var Raven = mongoose.model('Raven') // We are retrieving this Schema from our Models, named 'Raven'

	

//ROUTES
app.get('/', function (req, res){
	allravens = Raven.find({}, function(err, data){
		console.log(data);
		res.render('ravens', {title: "Cute Cuddly Birdies", allravens: data});
	});
});

app.get('/ravens/new', function (req, res){
	res.render('new', {title: "Cute Cuddly Birdies - Add a Raven"});
});

app.post('/ravens', function (req, res){
	var ravenInstance = new Raven(req.body)
	ravenInstance.save(function(err){
		console.log(err);
		res.redirect('/');
	});
});

app.get('/ravens/:id', function (req, res){
	thisraven = Raven.findOne({_id: req.params.id}, function(err, data){ 
	res.render('stats', {title: "Cute Cuddly Birdies - Raven stats", thisraven: data});
	});
});

app.get('/ravens/edit/:id', function (req, res){
	thisraven = Raven.findOne({_id: req.params.id}, function(err, data){ 
	res.render('edit', {title: "Cute Cuddly Birdies - Raven stats", thisraven: data});
	});
});

app.post('/ravens/:id', function (req, res){
	Raven.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: false}, function(err, data){
			res.redirect('/');
	});
});

app.get('/ravens/destroy/:id', function (req, res){
	Raven.remove({_id: req.params.id}, function(err, data){
			res.redirect('/');
	});
});



//LISTEN ON PORT - KEEP THIS AT THE END
app.listen(8000, function() {
  console.log("listening on port 8000");
})
