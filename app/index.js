var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	path = require('path'),
	mkdirp = require('mkdirp');

// Constructor
var Generator = module.exports = function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	// Success message
	this.on('end', function () {
		this.log.ok('Rufio! Rufio! Your Rufio site is ready.');
	}.bind(this));
};
inherits(Generator, yeoman.generators.Base);

// Prompt for info
Generator.prototype.ask = function() {
	var done = this.async();

	var defaultTitle = process.cwd().split('/');
	defaultTitle = defaultTitle[defaultTitle.length-1];

	this.prompt([{
		name: 'title',
		message: 'Site Title:',
		default: defaultTitle,
		validate: function(val) {
			return typeof val !== 'undefined' && val != '';
		}
	}, {
		name: 'hostname',
		message: 'Site Hostname:',
		validate: function(val) {
			return typeof val !== 'undefined' && val != '';
		}
	}, {
		name: 'author',
		message: 'Site Author:',
		validate: function(val) {
			return typeof val !== 'undefined' && val != '';
		}
	}, {
		name: 'tagline',
		message: 'Tagline:'
	}], function(input) {
		this.input = input;
		done();
	}.bind(this));
};

// Creates the directories and copies the core files
Generator.prototype.init = function() {
	mkdirp('media');
	this.template('package.json');
	this.template('rufio.json');
	this.copy('gitignore', '.gitignore');
	this.copy('Gruntfile.js', 'Gruntfile.js');
};

// Create a theme
Generator.prototype.makeTheme = function() {
	var done = this.async();
	this.invoke('rufio:theme', {
		args: ['default']
	}, function() {
		done();
	});
};

// Create types
Generator.prototype.createType = function() {

	// Async
	var done = this.async();

	// Prompt for type
	this.prompt([{
		name: 'name',
		message: 'Create type, leave blank to skip (ex: page):'
	}], function(input) {
		if (input.name !== '') {
			this.invoke('rufio:type', {
				args: [input.name]
			}, function() {
				// Recurse to allow for creating multiple types
				this.createType();
			}.bind(this));
		} else {
			done();
		}
	}.bind(this));

};

// Create index page
Generator.prototype.createIndex = function() {
	// Async
	var done = this.async();

	// Make directories
	mkdirp(path.join('media', 'index'), function() {
		mkdirp(path.join('content', 'page'), function() {
			this.template('indexPage.md', path.join('content', 'page', 'index.md'));
			done();
		}.bind(this));
	}.bind(this));
};

// Install npm deps
Generator.prototype.install = function() {
	this.installDependencies();
};
