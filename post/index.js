var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	util = require('../lib/util');

var Generator = module.exports = function Generator(args, options, config) {
	yeoman.generators.NamedBase.apply(this, arguments);

	if (typeof this.name === 'undefined') {
		this.log.write('Post title is required');
		process.exit();
	}

	// Load config
	this.conf = config.get();

	// Create date
	this.date = new Date();

	// Log success
	this.on('end', function () {
		this.log.ok('Your post is ready for writing sir!');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.init = function() {
	this.copy('post.md', util.path.join(this.conf.types.post.directory, util.dirify(this.name) + '.md'));
}
