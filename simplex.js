var simplex = require('simplex-solver');


exports.solve = function function_name (functionSimplex, vars, callback) {
	var result = simplex.maximize(functionSimplex, vars);
	callback(null, result);
}
