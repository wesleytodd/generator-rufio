var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits;

module.exports = Generator;

function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	this.on('end', function () {
		console.log('\nYEAH!!!  Your new Rufio site is ready to use!!'.green);
	});
};

inherits(Generator, yeoman.generators.Base);

Generator.prototype.init = function() {
	this.directory('.', '.');
}

Generator.prototype.makeTheme = function() {
	var themeGen = this.env.create('rufio:newtheme');
	themeGen.name = 'default';
	themeGen.run();

	var pageGen = this.env.create('rufio:newpage');
	pageGen.name = 'Index';
	pageGen.run();

	var postGen = this.env.create('rufio:newpost');
	postGen.name = 'Example Post';
	postGen.run();
}
