var mu2 = require('mu2');
/**
 * MU2 render function
 */
var mustacheEngine = function(path, options, fn) {
	var result = "";
	var view  = options.locals || {};
	mu2.compileAndRender(path, view).on('data', function(data) {
		result += data;
	}).on('end', function() {
		fn(null, result);
	}).on('error', function(e) {
		fn(e);
	});
};
exports.engine = mustacheEngine;