// Requires
var rufio = require('..');

module.exports = function (grunt) {

	// Load Rufio config
	var rufioConf = grunt.file.readJSON('rufio.json');

	grunt.registerTask('build', 'Build a Rufio site', function() {

		// Default Options
		var defaultOptions = {};

		// Merge config with defaults
		var options = grunt.util._.extend(defaultOptions, this.options());

		// Log options
		grunt.verbose.writeflags(options, 'Options');

		// Build all types
		rufio.build();
	});

	// Register a build task for each type
	for (var type in rufioConf.types) {
		(function(type) {
			grunt.registerTask('build-' + type, function() {
				rufio.buildType(type);
			});
		})(type);
	}

};
