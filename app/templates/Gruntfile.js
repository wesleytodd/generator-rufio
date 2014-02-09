module.exports = function(grunt) {
	
	//
	// Register npm tasks
	//
	[
		'grunt-contrib-clean',
		'grunt-contrib-copy',
		'grunt-contrib-htmlmin',
		'grunt-contrib-imagemin',
		'grunt-contrib-compass',
		'grunt-contrib-uglify',
		'grunt-contrib-watch',
		'grunt-concurrent',
		'grunt-prettify',
		'grunt-svgmin',
		'rufio',
	].forEach(grunt.loadNpmTasks);

	//
	// Register composte tasks
	//
	grunt.util._({
		'default': ['build-dev', 'concurrent:watch'],
		'build': ['clean:build', 'copy:favicon', 'copy:media', 'compass:build', 'rufio:prod', 'htmlmin:build', 'imagemin:build', 'svgmin:build', 'uglify:build'],
		'build-dev': ['clean:build', 'copy', 'compass:dev', 'rufio:dev', 'prettify:dev', 'imagemin:dev', 'svgmin:build'],
	}).map(function(task, name) {
		grunt.registerTask(name, task);
	});

	// Load rufio config
	var rufioConfig = grunt.file.readJSON('rufio.json');

	// Get the type directories for use in the watch task
	var typeDirs = [];
	for (var i in rufioConfig.types) {
		typeDirs.push(rufioConfig.types[i].directory);
	}

	//
	// Init Config
	//
	grunt.initConfig({

		// Load the rufio config
		config: rufioConfig,

		// Clean before building
		clean: {
			build: {
				src: ['<%= config.build.directory %>/<%= config.build.active %>']
			}
		},

		// Copy assets from template to build dir
		copy: {
			js: {
				files: [{
					expand: true,
					cwd: '<%= config.themes.directory %>/<%= config.themes.active %>/js',
					src: '{**/*.js,*.js}',
					dest: '<%= config.build.directory %>/<%= config.build.active %>/js/'
				}]
			},
			media: {
				files: {
					'<%= config.build.directory %>/<%= config.build.active %>': '<%= config.media.directory %>/**'
				}
			},
			vendor: {
				files: [{
					expand: true,
					cwd: '<%= config.themes.directory %>/<%= config.themes.active %>/bower_components',
					src: '**/*',
					dest: '<%= config.build.directory %>/<%= config.build.active %>/bower_components/'
				}]
			},
			favicon: {
				files: {
					'<%= config.build.directory %>/<%= config.build.active %>/favicon.ico': '<%= config.themes.directory %>/<%= config.themes.active %>/favicon.ico'
				}
			}
		},

		// Compile sass files
		compass: {
			options: {
				sassDir: '<%= config.themes.directory %>/<%= config.themes.active %>/scss',
				cssDir: '<%= config.build.directory %>/<%= config.build.active %>/css'
			},
			watch: {
				options: {
					outputStyle: 'expanded',
					watch: true
				}
			},
			dev: {
				options: {
					outputStyle: 'expanded'
				}
			},
			build: {
				options: {
					outputStyle: 'compressed'
				}
			}
		},

		 // For development, runs watch task along side the compass
		concurrent: {
			watch: {
				tasks: ['compass:watch', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		// Minify the html
		htmlmin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= config.build.directory %>/<%= config.build.active %>',
					src: '{**/*.html,*.html}',
					dest: '<%= config.build.directory %>/<%= config.build.active %>'
				}],
				options: {
					removeComments: true,
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					removeOptionalTags: true
				}
			}
		},

		// Copy and compress the images
		imagemin: {
			options: {
				pngquant: true
			},
			dev: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: '<%= config.themes.directory %>/<%= config.themes.active %>/images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= config.build.directory %>/<%= config.build.active %>/images/'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: '<%= config.themes.directory %>/<%= config.themes.active %>/images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= config.build.directory %>/<%= config.build.active %>/images/'
				}]
			}
		},

		// Prettify the development html
		prettify: {
			dev: {
				files: [{
					expand: true,
					cwd: '<%= config.build.directory %>/<%= config.build.active %>',
					src: '{**/*.html,*.html}',
					dest: '<%= config.build.directory %>/<%= config.build.active %>'
				}],
				options: {
					indent_char: '\t',
					indent: 1,
					indent_scripts: 'normal',
					brace_style: 'end-expand'
				}
			}
		},

		// Rufio build
		rufio: {
			dev: {
				options: {
					environment: 'dev'
				}
			},
			prod: {
				options: {
					environment: 'prod'
				}
			}
		},

		// Minify svg assets
		svgmin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= config.themes.directory %>/<%= config.themes.active %>/images',
					src: ['**/*.svg'],
					dest: '<%= config.build.directory %>/<%= config.build.active %>/images'
				}]
			}
		},
		
		// Minify javascript for production build
		uglify: {
			build: {
				files: {
					'<%= config.build.directory %>/<%= config.build.active %>/js/app.min.js': [
						'<%= config.themes.directory %>/<%= config.themes.active %>/js/app.js'
					]
				}
			}
		},

		// Watch for file changes and build as needed
		watch: {
			options: {
				forever: true,
				spawn: false,
				livereload: true
			},
			theme: {
				files: [
					'<%= config.themes.directory %>/<%= config.themes.active %>/*.html',
					'<%= config.themes.directory %>/<%= config.themes.active %>/partials/*.html',
					'<%= config.themes.directory %>/<%= config.themes.active %>/filters/*.js'
				],
				tasks: ['rufio:dev', 'prettify']
			},
			content: {
				files: typeDirs,
				tasks: ['rufio:dev', 'prettify']
			},
			js: {
				files: ['<%= config.themes.directory %>/<%= config.themes.active %>/js/**/*.js'],
				tasks: ['copy:js']
			},
			css: {
				files: ['<%= config.build.directory %>/<%= config.build.active %>/css/**/*.css']
			},
			vendor: {
				files: ['<%= config.themes.directory %>/<%= config.themes.active %>/bower_components/**/*'],
				tasks: ['copy:vendor']
			}
		},

	});

};
