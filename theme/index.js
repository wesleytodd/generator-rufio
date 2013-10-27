var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	util = require('../lib/util');

module.exports = Generator;

function Generator(args, options, config) {
	yeoman.generators.NamedBase.apply(this, arguments);

	if (typeof this.name === 'undefined') {
		this.log.write('Theme name is required');
		process.exit();
	}

	// Load config
	try {
		var file = this.read(util.path.join(process.cwd(), 'rufio.json'));
		this.conf = JSON.parse(file);
	} catch (e) {
		this.log.write('Config file does not exist or is not valid JSON!!!!');
		process.exit();
	}
	
	// Log on complete
	this.on('end', function () {
		this.log.ok('BOOM....' + this.name + ' theme created....');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.makeTheme = function() {
	var	dirName = util.path.join(this.conf.themes.directory, util.dirify(this.name));
	this.directory('.', dirName);
}
