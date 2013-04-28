// Requires
var fs = require('fs');

// Config File Path
var configFileName = 'config.json';

// Cached the loaded config
var configCached;

// Sets the config file name
var setFileName = function(name) {
	if (name !== configFileName) {
		configFileName = name;
		configCached = null;
	}
};

// Load the config if it exists
var read = function() {
	if (configCached) {
		return configCached;
	} else if (exists()) {
		var json = fs.readFileSync(configFileName);
		configCached = JSON.parse(json);
		return configCached;
	}
	return null;
};

// Check if config file exists
var exists = function() {
	return fs.existsSync(configFileName);
};

// Write to the config file
var write = function(configObject) {
	configCached = configObject;
	var contents = JSON.stringify(configObject, null, '\t');
	return fs.writeFileSync(configFileName, contents);
};

var set = function(key, val) {
	if (!configCached) {
		read();
	}
	configCached[key] = val;
};

// Exports
module.exports = {
	fileName : configFileName,
	read : read,
	exists : exists,
	write : write,
	set : set
}
