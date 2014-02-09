var yeoman = require('yeoman-generator'),
	inherits = require('util').inherits,
	mkdirp = require('mkdirp'),
	path = require('path'),
	Rufio = require('rufio');

module.exports = Generator;

function Generator() {
	yeoman.generators.NamedBase.apply(this, arguments);

	// Start Rufio
	this.rufio = new Rufio({
		rufio: {
			silent: true
		}
	});

	// Get the theme directory
	this.themeDir = this.rufio.config.get('themes:directory');

	// Dirify the name
	this.themeName = this.rufio.util.dirify(this.name);
	
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
		message: 'Bower packages to install, comma separated:',
		name: 'bowerPackages',
		default: 'angular',
	}], function(answers) {
		me.input = answers;
		me.input.name = me.name;
		done();
	});
};

// Make theme
Generator.prototype.makeTheme = function() {
	// Make sure the directory is there
	mkdirp(this.themeDir);
	// Copy the default theme
	this.bulkDirectory('.', path.join(this.themeDir, this.themeName));
};

// Install the bower components
Generator.prototype.installComponents = function() {
	if (this.input.bowerPackages) {
		var done = this.async();

		// Current dir
		var cwd = process.cwd();

		// Chdir to theme
		process.chdir(path.join(this.themeDir, this.themeName));

		// Split the list
		var pkgs = this.input.bowerPackages.split(',').map(Function.prototype.call, String.prototype.trim);

		// Install the packages
		this.bowerInstall(pkgs, {'save': true}, function(err) {
			// Install deps from bower deps
			this.bowerInstall([], function(err) {
				// Chdir back
				process.chdir(cwd);

				done();
			});
		}.bind(this));
	}
};
