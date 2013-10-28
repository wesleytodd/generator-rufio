var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	mkdirp = require('mkdirp');

var Generator = module.exports = function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	this.on('end', function () {
		this.log.ok('YEAH!!!  Your new Rufio site is ready to use!!');
	}.bind(this));
};
inherits(Generator, yeoman.generators.Base);

Generator.prototype.ask = function() {
	var done = this.async();

	var defaultTitle = process.cwd().split('/');
	defaultTitle = defaultTitle[defaultTitle.length-1];

	this.prompt([{
		name: 'title',
		message: 'Site Title:',
		default: defaultTitle
	}, {
		name: 'url',
		message: 'Site Hostname:'
	}, {
		name: 'tagline',
		message: 'Tagline:'
	}], function(input) {
		this.input = input;
		done();
	}.bind(this));
};

Generator.prototype.init = function() {
	mkdirp('filters');
	this.template('bower.json');
	this.template('package.json');
	this.template('rufio.json');
	this.copy('bowerrc', '.bowerrc');
	this.copy('gitignore', '.gitignore');
	this.copy('Gruntfile.js', 'Gruntfile.js');
	this.copy('filters/navList.js', 'filters/navList.js');
};

Generator.prototype.makeTheme = function() {
	this.env.create('rufio:theme', {
		'arguments': ['default']
	}).run();

	this.env.create('rufio:page', {
		'arguments': ['Index']
	}).run();

	this.env.create('rufio:post', {
		'arguments': ['Example Post'],
	}).run();
};
