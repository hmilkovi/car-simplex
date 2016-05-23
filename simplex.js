var YASMIJ = require('yasmij');


exports.solve = function function_name (type ,functionSimplex, vars, callback) {
	console.log(vars);
	var input = {
		type: type,
		objective : functionSimplex.replace('\r',''),
		constraints : vars
	};
	var result = YASMIJ.solve(input);
	callback(null, result);
}
