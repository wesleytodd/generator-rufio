var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	config = require('../lib/config'),
	mkdirp = require('mkdirp'),
	util = require('../lib/util');

var Generator = module.exports = function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	if (typeof this.name === 'undefined') {
		this.log.write('Page name is required');
		process.exit();
	}

	// Load config
	this.conf = config.get();

	// Log success
	this.on('end', function () {
		this.log.ok('You\'re pager is buzzing.');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.init = function() {
	mkdirp('page');
	this.copy('page.md', util.path.join(this.conf.types.page.directory, util.dirify(this.name) + '.md'));
}
