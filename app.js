var express = require("express");
var app = express();
app.use(express.static('public'));

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
// 		    	if (item.description != null) {
// 		    		item.description = item.description.replace(/'/g, "").replace(/[^\x00-\x7F]/g, "");
// 		    	}
// 		    	var s = 'INSERT INTO repositories(name, url, author, description, created, updated, size, language, forks, issues, watchers) VALUES (\''
// 		    			+item.name+'\',\''
// 		    			+item.svn_url+'\',\''
// 		    			+item.owner.login+'\',\''
// 		    			+item.description+'\',\''
// 		    			+item.created_at+'\',\''
// 		    			+item.updated_at+'\','
// 		    			+item.size+',\''
// 		    			+item.language+'\','
// 		    			+item.forks+','
// 		    			+item.open_issues+','
// 		    			+item.watchers+')';
// 				connection.query(s, function (error, results, fields) {
// 					if (error){
// 						console.log(s);
// 						throw error;
						
// 					} 
// 				});
// 			});
// 		}		
// 	};

// 	request(options, callback);
// };

// languages.forEach(function(language) {
// 	getAPI(language);
// });

var repositories = []

var p = 'SELECT COUNT(*) as tot FROM (SELECT name AS name, url AS url, author AS author, description AS description, created AS created, updated AS updated, size AS size, language AS language, forks AS forks, issues AS issues, watchers AS watchers FROM repositories) AS total';
connection.query(p, function (error, results, fields) {
	var total = results[0].tot;
	var q = 'SELECT name AS name, url AS url, author AS author, description AS description, created AS created, updated AS updated, size AS size, language AS language, forks AS forks, issues AS issues, watchers AS watchers FROM repositories ORDER BY name';
	connection.query(q, function (error, results, fields) {
		if (error) throw error;
		for (var i = 0; i < total; i++) {
			var name = results[i].name;
			var url = results[i].url;
			var author = results[i].author;
			var description = results[i].description;
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
									description: description,
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
	res.render("landing", {languages:languages});
});

app.get("/c", function(req, res) {
	res.render("c", {repositories:repositories});
});

app.get("/javascript", function(req, res) {
	res.render("javascript", {repositories:repositories});
});

app.get("/css", function(req, res) {
	res.render("css", {repositories:repositories});
});

app.get("/html", function(req, res) {
	res.render("html", {repositories:repositories});
});

app.get("/sql", function(req, res) {
	res.render("sql", {repositories:repositories});
});

app.get("/all-repositories", function(req, res) {
	res.render("all-repositories", {repositories:repositories});
});

app.listen(process.env.PORT || port);