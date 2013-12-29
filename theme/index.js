var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	mkdirp = require('mkdirp'),
	rufio = require('rufio');

module.exports = Generator;

function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	// Load config
	this.conf = rufio.config.get();
	
	// Log on complete
	this.on('end', function () {
		this.log.ok('BOOM....' + this.name + ' theme created....');
	}.bind(this));
};
inherits(Generator, yeoman.generators.NamedBase);

// Get User input
Generator.prototype.ask = function() {
	var me = this,
		done = this.async();

	this.prompt([{
		message: 'Bowser componenets directory',
		name: 'bowerDir',
		default: 'bower_components'
	}, {
		message: 'Bower packages to install, comma separated (modernizr,angular#1.2.0)',
		name: 'bowerPackages'
	}], function(answers) {
		me.userInput = answers;
		done();
	});
};

Generator.prototype.makeTheme = function() {
	mkdirp('themes');
	this.directory('.', rufio.util.path.join(this.conf.themes.directory, rufio.util.dirify(this.name)));
};

Generator.prototype.installComponents = function() {
	if (this.userInput.bowerPackages) {
		var done = this.async();

		// Chdir to theme
		process.chdir(rufio.util.path.join(this.conf.themes.directory, rufio.util.dirify(this.name)));

		// Split the list
		var pkgs = this.userInput.bowerPackages.split(',')
			.map(function(i) {
				return i.trim();
			});

		// Install the packages
		this.bowerInstall(pkgs, function() {
			done();
		});
	}
};
