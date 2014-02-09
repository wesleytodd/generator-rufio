var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	mkdirp = require('mkdirp'),
	path = require('path'),
	Rufio = require('rufio');

var Generator = module.exports = function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	// Start Rufio
	this.rufio = new Rufio({
		rufio: {
			silent: true
		}
	});

	// Log on complete
	this.on('end', function () {
		this.log.ok('Your new type is ready for use.');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

// Prompt for info
Generator.prototype.ask = function() {
	var done = this.async();

	this.prompt([{
		name: 'directory',
		message: 'Directory:',
		default: path.join('content', this.name),
		validate: function(val) {
			return typeof val !== 'undefined' && val != '';
		}
	}, {
		name: 'permalink',
		message: 'Permalink Structure:',
		default: '/<%= type %>/<%= meta.slug %>.html',
		validate: function(val) {
			return typeof val !== 'undefined' && val != '';
		}
	}, {
		name: 'filters',
		message: 'Filters:',
		default: 'template,markdown',
		validate: function(val) {
			return typeof val !== 'undefined' && val != '';
		}
	}, {
		name: 'jsonPermalink',
		message: 'JSON Permalink Structure:',
		default: '/<%= type %>/<%= meta.slug %>.json',
		when: function() {
			return (this.rufio.config.get('plugins:active') || []).indexOf('json') !== -1;
		}.bind(this)
	}], function(input) {
		this.input = input;
		done();
	}.bind(this));
};

Generator.prototype.makeDirs = function() {

	// Async
	var done = this.async();

	// Media directory
	mkdirp(path.join(this.rufio.config.get('media:directory'), this.name), function() {

		// Content directory
		mkdirp(path.join(this.input.directory), done);

	}.bind(this));
};

// Add the type info to the rufio.json
Generator.prototype.editRufioJson = function() {

	// Async
	var done = this.async();

	// Add to the config
	this.rufio.config.set('types:' + this.name, this.input);

	// Save the rufio.json
	this.rufio.config.save(function(err) {
		if (err) {
			this.log.error(err);
		}
		done();
	}.bind(this));
};
