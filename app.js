const PORT = process.env.PORT || 3000

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root', 
	password : 'password',
	database : 'git'
});

var request = require('request');
var languages = ['C', 'Javascript', 'CSS', 'HTML', 'SQL'];

// function getAPI(language) {
// 	var options = {
// 	  url: 'https://api.github.com/search/repositories?sort=stars&order=desc&q=language:'+language,
// 	  headers: {
// 	    'User-Agent': 'Git Repositories'
// 	  }
// 	};
	 
// 	function callback(error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 		    var info = JSON.parse(body);
// 		    info.items.forEach(function(item) {
// 		    	var s = 'INSERT INTO repositories(name, url, author, created, updated, size, language, forks, issues, watchers) VALUES (\''
// 		    			+item.name+'\',\''
// 		    			+item.svn_url+'\',\''
// 		    			+item.owner.login+'\',\''
// 		    			+item.created_at+'\',\''
// 		    			+item.updated_at+'\','
// 		    			+item.size+',\''
// 		    			+item.language+'\','
// 		    			+item.forks+','
// 		    			+item.open_issues+','
// 		    			+item.watchers+')';
// 				connection.query(s, function (error, results, fields) {
// 			   	});
// 			});
// 		}		
// 	};

// 	request(options, callback);
// };

// languages.forEach(function(language) {
// 	getAPI(language);
// });

var repositories = []

var p = 'SELECT COUNT(*) as tot FROM (SELECT name AS name, url AS url, author AS author, created AS created, updated AS updated, size AS size, language AS language, forks AS forks, issues AS issues, watchers AS watchers FROM repositories) AS total';
connection.query(p, function (error, results, fields) {
	var total = results[0].tot;
	var q = 'SELECT name AS name, url AS url, author AS author, created AS created, updated AS updated, size AS size, language AS language, forks AS forks, issues AS issues, watchers AS watchers FROM repositories ORDER BY name';
	connection.query(q, function (error, results, fields) {
		if (error) throw error;
		for (var i = 0; i < total; i++) {
			var name = results[i].name;
			var url = results[i].url;
			var author = results[i].author;
			var created = results[i].created;
			var updated = results[i].updated;
			var size = results[i].size;
			var language = results[i].language;
			var forks = results[i].forks;
			var issues = results[i].issues;
			var watchers = results[i].watchers;
			var newRepository = {	name: name, 
									url: url, 
									author: author, 
									created: created, 
									updated: updated,
									size: size,
									language: language,
									forks: forks,
									issues: issues,
									watchers: watchers
								};
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
	// var description = req.body.description;
	var author = req.body.author;
	var newRepository = {name: name, author: author};
	repositories.push(newRepository);
	res.redirect("/repositories");
});

app.get("/repositories/new", function (req, res) {
	res.render("new.ejs");
});

app.listen(PORT, process.env.IP, function() {
	console.log("The server has started!")
});