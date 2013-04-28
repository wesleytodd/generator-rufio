// Requires
var fs = require('fs'),
	path = require('path'),
	marked = require('marked'),
	config = require('../config'),
	util = require('../util'),
	helpers = require('../helpers'),
	types = require('../types');

// Generates a single data type
var buildDataType = function(type, types) {
	var conf = config.read();

	// Load theme helpers
	var helpersFile = path.resolve(path.join(conf.themes.directory, conf.themes.active, 'helpers.js'));
	if (fs.existsSync(helpersFile)) {
		require(helpersFile)(util.handlebars);
	}

	for (var i in types[type].items) {
		var item = types[type].items[i];
		var parsedContent = helpers.getTemplate(type, item.meta)({
			config : conf,
			types : types,
			meta : item.meta,
			content : item.content,
			permalink : item.permalink
		});
		util.writeFile(path.join(conf.build.directory, item.permalink), parsedContent);
	}
};

module.exports = function (grunt) {

	grunt.registerTask('build', function() {

		if (!fs.existsSync(config.read().build.directory)) {
			fs.mkdirSync(config.read().build.directory);
		}

		var t = types.compileAllTypes();
		for (var type in t) {
			buildDataType(type, t);
		}
	});

	for (var type in config.read().types) {
		(function(type) {
			grunt.registerTask('build-' + type, function() {
				buildDataType(type, types.compileAllTypes());
			});
		})(type);
	}

};
