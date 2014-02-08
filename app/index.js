var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
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

// Install npm deps
Generator.prototype.install = function() {
	this.installDependencies();
};
