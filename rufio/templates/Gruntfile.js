module.exports = function(grunt) {
	
	grunt.initConfig({
		rufio : grunt.file.readJSON('config.json')
	});

	grunt.loadNpmTasks('generator-rufio');

};
