var YASMIJ = require('yasmij');


exports.solve = function function_name (functionSimplex, vars, callback) {
	var input = {
		type: "maximize",
		objective : functionSimplex,
		constraints : vars
	};
	var result = YASMIJ.solve(input);
	callback(null, result);
}
