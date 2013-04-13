var fs = require('fs'),
	path = require('path'),
	marked = require('marked'),
	config = require('../config'),
	util = require('../util'),
	helpers = require('../helpers');

var buildDataType = function(type) {
	var conf = config.read();
	util.eachFileInDir(conf.types[type].directory, function(fileName) {
		// Get the file contents
		var filePath = path.join(conf.types[type].directory, fileName),
			// Read the meta information from the header of the file
			fileMeta = helpers.getMeta(filePath),
			// Strip our the meta information and just return the contents
			fileContent = marked(helpers.getContent(filePath)),
			// Build the template and render it
			parsedContent = helpers.getTemplate(type, fileMeta)({
				meta : fileMeta,
				content : fileContent
			}),
			// Get the permalink structure for the content type
			permalink = helpers.getPermalinkTemplate(type)(fileMeta);

		// Write the file
		util.writeFile(path.join(conf.build.directory, permalink), parsedContent);
	});
};

module.exports = function (grunt) {

	var allTasks = ['create-build-dir'];

	grunt.registerTask('create-build-dir', function() {
		var conf = config.read().build;

		// Remove the existing directory if it exists
		if (fs.existsSync(conf.directory)) {
			util.wrench.rmdirSyncRecursive(conf.directory);
		}
		fs.mkdirSync(conf.directory);

	});

	for (var type in config.read().types) {
		allTasks.push('build-' + type);
		(function(type) {
			grunt.registerTask('build-' + type, function() {
				buildDataType(type);
			});
		})(type);
	}

	grunt.registerTask('build', allTasks);
};
