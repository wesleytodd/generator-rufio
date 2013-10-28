var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	mkdirp = require('mkdirp'),
	rufio = require('rufio');

module.exports = Generator;

function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	if (typeof this.name === 'undefined') {
		this.log.write('Theme name is required');
		process.exit();
	}

	// Load config
	this.conf = rufio.config.get();
	
	// Log on complete
	this.on('end', function () {
		this.log.ok('BOOM....' + this.name + ' theme created....');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.makeTheme = function() {
	mkdirp('themes');
	this.directory('.', rufio.util.path.join(this.conf.themes.directory, rufio.util.dirify(this.name)));
}
