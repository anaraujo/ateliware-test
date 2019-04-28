const PORT = process.env.PORT || 3000

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");

var repositories = []

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',  //your username
	password : 'password',
	database : 'test'
});

var p = 'SELECT COUNT(*) as tot FROM (SELECT name AS name, description AS description, author AS author FROM test_table) AS total';
connection.query(p, function (error, results, fields) {
	var total = results[0].tot;
	var q = 'SELECT name AS name, description AS description, author AS author FROM test_table';
	connection.query(q, function (error, results, fields) {
		if (error) throw error;
		for (var i = 0; i < total; i++) {
			var name = results[i].name;
			var description = results[i].description;
			var author = results[i].author;
			var newRepository = {name: name, description: description, author: author};
			repositories.push(newRepository);
		}	
	});	
});	

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function (req, res){
	res.render("landing");
});

app.get("/repositories", function(req, res) {
	res.render("repositories", {repositories:repositories});
});

app.post ("/repositories", function(req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var author = req.body.author;
	var newRepository = {name: name, description: description, author: author};
	repositories.push(newRepository);
	res.redirect("/repositories");
});

app.get("/repositories/new", function (req, res) {
	res.render("new.ejs");
});

app.listen(PORT, process.env.IP, function() {
	console.log("The server has started!")
});