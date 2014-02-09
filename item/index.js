var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	mkdirp = require('mkdirp'),
	path = require('path'),
	Rufio = require('rufio');

var Generator = module.exports = function Generator() {
	yeoman.generators.Base.apply(this, arguments);

	// Start Rufio
	this.rufio = new Rufio({
		rufio: {
			silent: true
		}
	});

	// Log on complete
	this.on('end', function () {
		this.log.ok('Item created.');
	}.bind(this));
};
inherits(Generator, yeoman.generators.Base);

// Prompt for info
Generator.prototype.ask = function() {
	var done = this.async();

	this.prompt([{
		name: 'title',
		message: 'Title:',
		validate: function(val) {
			return typeof val !== 'undefined' && val != '';
		}
	}, {
		name: 'type',
		message: 'Type:',
		type: 'list',
		choices: Object.keys(this.rufio.config.get('types'))
	}], function(input) {
		this.input = input;

		// Set date
		this.input.date = new Date();

		// Prompt for slug
		this.prompt({
			name: 'slug',
			message: 'Slug:',
			default: this.rufio.util.dirify(this.input.title)
		}, function(input) {
			this.input.slug = input.slug;
			done();
		}.bind(this));
	}.bind(this));
};

Generator.prototype.makeDirs = function() {

	// Async
	var done = this.async();

	// Media directory
	mkdirp(path.join(this.rufio.config.get('media:directory'), this.input.type, this.input.slug), function() {

		// Copy template
		this.copy('item.md', path.join(this.rufio.config.get('types:' + this.input.type + ':directory'), this.input.slug + '.md'));

		done();

	}.bind(this));
};
