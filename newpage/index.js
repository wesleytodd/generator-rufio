var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	path = require('path'),
	config = require('../config'),
	util = require('../util');

module.exports = Generator;

function Generator(args, options, config) {
	yeoman.generators.NamedBase.apply(this, arguments);
	this.on('end', function () {
		console.log('\nPage?  What Page?  Oh, it\' done...'.green);
	});
};

inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.makePage = function() {
	var conf = config.read().types.page,
		fileName = util.dirify(this.name) + '.' + (conf.suffix || 'md'),
		filePath = path.join('.', conf.directory, fileName);

	this.created = new Date().toUTCString();
	this.template('page.html', filePath);
}

