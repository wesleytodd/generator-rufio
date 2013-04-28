var fs = require('fs'),
	path = require('path'),
	marked = require('marked'),
	util = require('./util'),
	helpers = require('./helpers'),
	config = require('./config');

var compileAllTypes = function() {
	var out = {};
	eachType(function(type) {
		out[type] = compileType(type);
	});
	return out;
};

var eachType = function(fnc) {
	var types = config.read().types;
	for (var t in types) {
		fnc(t, types[t]);
	}
};

var typeExists = function(type) {
	return !!(config.read().types[type] && fs.existsSync(config.read().types[type].directory));
};

var compileType = function(type) {
	if (typeExists(type)) {
		var conf = config.read().types[type],
			out = {
				config : conf,
				items : []
			};
		util.eachFileInDir(conf.directory, function(fileName) {
			out.items.push(compileItem(type, path.join(conf.directory, fileName)));
		});
		return out;
	}
};

var compileItem = function(type, filePath) {
	var
		// Read the meta information from the header of the file
		fileMeta = helpers.getMeta(filePath),
		// Strip our the meta information and just return the contents
		fileContent = helpers.getContent(filePath).trim(),
		// Get the permalink structure for the content type
		permalink = helpers.getPermalinkTemplate(type)(fileMeta);

	// Parse the markdown if it is not turned off
	if (typeof fileMeta.markdown === 'undefined' || fileMeta.markdown != 'false') {
		fileContent = marked(fileContent);
	} 

	return {
		meta : fileMeta,
		content : fileContent,
		permalink : permalink
	}
};

module.exports = {
	compileAllTypes : compileAllTypes,
	compileType : compileType
}
