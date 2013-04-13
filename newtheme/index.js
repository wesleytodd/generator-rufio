var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	path = require('path'),
	config = require('../config'),
	util = require('../util');

module.exports = Generator;

function Generator(args, options, config) {
	yeoman.generators.NamedBase.apply(this, arguments);
	this.on('end', function () {
		console.log('\nBOOM....'.green + this.name.green + ' theme created....'.green);
	});
};

inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.makeTheme = function() {
	var	dirName = path.join(config.read().themes.directory, util.dirify(this.name));
	this.directory('.', dirName);
}
