var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var http = require('http');
var path = require('path');
var solver = require("javascript-lp-solver");

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
	var funkcija = req.body.funkcija.replace('\r','');
	var variables = funkcija.match(/[a-zA-z]/g);
	var type = "max: ";
	if (req.body.teziste == 'Minimum') {
		type = 'min: ';
	}

	var  model = [];
	model.push(type + funkcija);

	ogranicenja.forEach(function(entry, idx, array) {
		model.push(entry);
	});
	  
	// Reformat to JSON model              
	model = solver.ReformatLP(model);
	  
	// Solve the model
	var data =  solver.Solve(model);

	for (var i = 0; i < variables.length; i++) {
		if (Object.keys(data).indexOf(variables[i]) < 0) {
			data[variables[i]] = 0;
		}
	}

	res.json(data);
});
//10.255.0.34
app.listen(5000, "10.255.0.34", function () {
  console.log('App listening on port 5000!');
});
