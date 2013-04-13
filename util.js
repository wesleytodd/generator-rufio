// Requires
var fs = require('fs'),
	wrench = require('wrench'),
	mkdirp = require('mkdirp'),
	path = require('path'),
	handlebars = require('handlebars');

// Dirify a string
var dirify = function(str) {
	return str
		// Replace all non alpha-numeric
		.replace(/[^a-zA-Z0-9]/g, '-')
		// Remove multiple adjacent dashes
		.replace(/-+/g, '-')
		// Remove starting dashes
		.replace(/^-*/g, '')
		// Remove trailing dashes
		.replace(/-*$/g, '')
		// All lowercase
		.toLowerCase();
};

// Compile a template from a file path
var compileTmlpFile = function(filePath) {
	if (fs.existsSync(filePath)) {
		return handlebars.compile(fs.readFileSync(filePath, 'utf8'));
	} else {
		return handlebars.compile('');
	}
};

// Execute a callback for each file in a directory
var eachFileInDir = function(path, fnc) {
	var files = wrench.readdirSyncRecursive(path);
	for (var f in files) {
		if (files[f].indexOf('.') !== 0) {
			fnc(files[f], path, files);
		}
	}
};

// Writes a file, and creates any needed directories
var writeFile = function(filePath, contents, done) {
	var parts = filePath.split('/');
	var pathParts = parts.splice(0, parts.length - 1)
	mkdirp.sync(path.join.apply(null, pathParts));
	fs.writeFileSync(filePath, contents);
};


// Exports
module.exports = {
	handlebars : handlebars,
	compileTmlpFile : compileTmlpFile,
	dirify : dirify,
	eachFileInDir : eachFileInDir,
	writeFile : writeFile,
	wrench : wrench
}
