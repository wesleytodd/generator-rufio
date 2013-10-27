module.exports = function(grunt) {
	
	grunt.initConfig({
		rufio : grunt.file.readJSON('rufio.json'),
		connect : {
			server : {
				options : {
					port : 9000,
					base : '<%= rufio.build.directory %>',
					keepalive : true
				}
			}
		},
		sass : {
			build : {
				options : {
					style: 'compressed'
				},
				files : {
					'<%= rufio.build.directory %>/css/global.css' : '<%= rufio.themes.directory %>/<%= rufio.themes.active %>/scss/*.scss'
				}
			}
		},
		uglify : {
			build : {
				files : {
					'<%= rufio.build.directory %>/js/global.js' : '<%= rufio.themes.directory %>/<%= rufio.themes.active %>/js/*.js'
				}
			}
		},
		bower: {
			dev: {
				dest: '<%= rufio.build.directory %>/js/vendor'
			}
		}
	});

	grunt.loadNpmTasks('generator-rufio');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bower');

	grunt.registerTask('default', ['build', 'sass', 'uglify', 'bower', 'connect']);

};
