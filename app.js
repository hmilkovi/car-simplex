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
	var ogranicenja = req.body.ogranicenja.split(',');
	var funkcija = req.body.funkcija;
	var re = /[a-zA-z]{1,}/g;
	var variables = funkcija.match(re);
	console.log(variables);
	var min = false;

	if (req.body.teziste == 'Minimum') {
		var originalDual = dual.toMaximum(funkcija, ogranicenja);
		ogranicenja = originalDual.ogranicenja;
		funkcija = originalDual.funkcija;
		min = true;
	}
	simplex.solve(funkcija, ogranicenja, function (err, data) {
		if (min) {
			var result = data.tableaus[data.tableaus.length-1];
			var matrix = Matrix(result.rows);
			matrix = matrix.transpose();
			console.log(matrix);
			var results = [];
			for (var i = 1; i < matrix.numRows - 1; i++) {
				var temp = matrix[i.toString()].join('');
				var jedinicanVektor = /^(([1]{1}[0]{1,})|([0]{1,}[1]{1})|([0]{1,}[1][0]{1,}))$/;
				if (temp.match(jedinicanVektor)) {
					var tempVar = matrix[(matrix.numRows - 1).toString()][matrix[i.toString()].indexOf(1)];
					if (result.variables[i].match(/^s[0-9]{1,}$/)) {
						results.push(tempVar);
					} else {
						results.push(0);
					}

				}
			}
			console.log(results);
			var finalData = {
				'max': data.max,
			};
			for (var i = 0; i < variables.length; i++) {
				finalData[variables[i]] = results[i];
			};
			console.log(finalData);
			res.json(finalData);
		} else {
			res.json(data);
		}
	});
});

app.listen(5000, "10.255.0.34", function () {
  console.log('App listening on port 5000!');
});
