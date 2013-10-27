var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits;
;

var Generator = module.exports = function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	this.on('end', function () {
		this.log.ok('YEAH!!!  Your new Rufio site is ready to use!!');
	}.bind(this));
};
inherits(Generator, yeoman.generators.Base);

Generator.prototype.init = function() {
	this.directory('.', '.');
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
