var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	mkdirp = require('mkdirp'),
	rufio = require('rufio');

var Generator = module.exports = function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	if (typeof this.name === 'undefined') {
		this.log.write('Page name is required');
		process.exit();
	}

	// Load config
	this.conf = rufio.config.get();

	// Log success
	this.on('end', function () {
		this.log.ok('You\'re pager is buzzing.');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.init = function() {
	var slug = rufio.util.dirify(this.name);
	mkdirp(rufio.util.path.join(this.conf.media.directory, slug));
	mkdirp('pages');
	this.copy('page.md', rufio.util.path.join(this.conf.types.page.directory, slug + '.md'));
}
