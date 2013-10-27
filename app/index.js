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

Generator.prototype.init = function() {
	this.directory('.', '.');
	mkdirp('themes');
	mkdirp('page');
	mkdirp('post');
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
