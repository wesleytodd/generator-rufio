var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	config = require('../lib/config'),
	mkdirp = require('mkdirp'),
	util = require('../lib/util');

module.exports = Generator;

function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	if (typeof this.name === 'undefined') {
		this.log.write('Theme name is required');
		process.exit();
	}

	// Load config
	this.conf = config.get();
	
	// Log on complete
	this.on('end', function () {
		this.log.ok('BOOM....' + this.name + ' theme created....');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.makeTheme = function() {
	mkdirp('themes');
	this.directory('.', util.path.join(this.conf.themes.directory, util.dirify(this.name)));
}
