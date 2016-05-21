var Matrix = require('node-matrix');

var alphabet = "abcdefghijklmnopqrstuvwxyz";
var re = /([+,-]{0,1}\s{1,}[0-9]{0,}[a-zA-z]{1,})|([+,-]{0,1}[0-9]{0,}[a-zA-Z]{1,})/g;
var re1 = /([0-9]{1,})|([+,-]\s{0,}[0-9]{1,})/g;

exports.toMaximum = function (funkcija, ogranicenja) {
	var data = {
		funkcija: '',
		ogranicenja: []
	};
	ogranicenja.forEach(function(entry, idx, array) {
		var temp = entry;
		if (temp.indexOf('<=') > -1) {
			data.funkcija +=  (temp.split('<=')[1] + alphabet[idx]);
			temp = temp.split('<=')[0].match(re);
			temp.forEach(function(entry, idx, array) {
				if (entry.indexOf('+') > -1) {
					temp[idx] = entry.replace('+','-');
				} else if (entry.indexOf('-') > -1) {
					temp[idx] = entry.replace('-','+');
				} else {
					temp[idx] = '-' + entry;
				}
				temp[idx] = temp[idx].replace(/(\r\n|\n|\r)/gm,"");
			});
			data.ogranicenja.push(temp);
		} else if (temp.indexOf('>=') > -1) {
			data.funkcija +=  (temp.split('>=')[1] + alphabet[idx]);
			temp = temp.split('>=')[0].match(re);
			data.ogranicenja.push(temp);
		} else {
			data.funkcija +=  (temp.split('=')[1] + alphabet[idx]);
			data.funkcija += '-';
			data.funkcija +=  (temp.split('=')[1] + alphabet[idx+1]);
			data.ogranicenja.push(temp.split('=')[0].replace(/(\r\n|\n|\r)/gm,"").match(re));
			temp = temp.split('=')[0].match(re);
			temp.forEach(function(entry, idx, array) {
				if (entry.indexOf('+') > -1) {
					temp[idx] = entry.replace('+','-');
				} else if (entry.indexOf('-') > -1) {
					temp[idx] = entry.replace('-','+');
				} else {
					temp[idx] = '-' + entry;
				}
				temp[idx] = temp[idx].replace(/(\r\n|\n|\r)/gm,"");
			});
			data.ogranicenja.push(temp);
		}
		if (idx !== array.length - 1){
			data.funkcija += '+';
		}
	});
	var matrix = Matrix(data.ogranicenja);
	matrix = matrix.transpose();
	var funkcija = funkcija.match(re1);
	console.log(funkcija);
	data.ogranicenja = [];
	for (var i = 0; i < matrix.numRows; i++ ) {
		matrix[i.toString()].forEach(function(entry, idx, array) {
			if (!(entry.indexOf('+') > -1 || entry.indexOf('-') > -1)) {
				matrix[i.toString()][idx] = '+' + matrix[i.toString()][idx];
			}
			matrix[i.toString()][idx] = matrix[i.toString()][idx].match(re1) + alphabet[idx];
		});
		var temp_ogranicenje = matrix[i.toString()].join('') + '<=' + funkcija[i]
		data.ogranicenja.push(temp_ogranicenje);
	}
	console.log(data);
	return data;
}