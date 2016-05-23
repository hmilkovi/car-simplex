var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var http = require('http');
var path = require('path');
var simplex = require('./simplex.js');
var dual = require('./simplex-dual.js');
var Matrix = require('node-matrix');

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/oi', function(req, res) {
    res.render('pages/index');
});

app.post('/oi/simplex', function(req, res) {
	var ogranicenja = req.body.ogranicenja.replace('\r','').split('\n');
	var funkcija = req.body.funkcija;
	var re = /[a-zA-z]{1,}/g;
	var type = "maximize";

	if (req.body.teziste == 'Minimum') {
		var originalDual = dual.toMaximum(funkcija, ogranicenja);
		ogranicenja = originalDual.ogranicenja;
		funkcija = originalDual.funkcija;
	}
	simplex.solve(type, funkcija, ogranicenja, function (err, data) {
		console.log(data);
		res.json(data);
	});
});

app.listen(5000, "10.255.0.34", function () {
  console.log('App listening on port 5000!');
});
