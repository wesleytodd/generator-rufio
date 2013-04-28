// Requires
var fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	config = require('./config'),
	util = require('./util');

// Meta Delimiters
var startToken = config.read().rufio.metaTokens.start;
var endToken = config.read().rufio.metaTokens.end;

// Template Extention
var templateExt = config.read().rufio.templateExtention;

// Meta RegEx
var metaRegx = new RegExp(startToken + '(.+)' + endToken);

// Parse the meta data
var getMeta = function(filepath) {
	// Create output object
	var output = {};

	// Get file contents
	var contents = fs.readFileSync(filepath, 'utf8');

	// Join lines then match the meta section and split on the line token
	var headers = contents.replace(/\n/g, '<|>').match(metaRegx)[1].split('<|>');

	// Remove the starting and ending tokens
	headers = headers.splice(1, headers.length - 2);

	var filename = filepath.split('/');
	output['slug'] = filename[filename.length-1].split('.')[0];

	// Add each header to the output object
	for (var h in headers) {
		var keyVal = headers[h].split(':');
		switch(keyVal[0]) {
			case 'date' :
				keyVal.shift();
				keyVal = keyVal.join(':');
				var d = new Date(keyVal);
				output['date'] = {
					full : d.toString(),
					minute : d.getMinutes(),
					hour : d.getHours(),
					day : d.getDate(),
					month : d.getMonth() + 1,
					year : d.getFullYear()
				};
				break;
			default :
				output[keyVal.shift()] = keyVal.join(':').trim();
				break;
		}
	}

	// Return the parsed meta
	return output;
};

// Get the contents after ending token
var getContent = function(filepath) {
	// Get file contents
	var contents = fs.readFileSync(filepath, 'utf8');

	return contents.substr(contents.indexOf(endToken) + endToken.length);
}

// Set the template extention
var setTemplateExt = function (ext) {
	templateExt = ext;
} 

// Get template path
var getTemplate = function(type, headers) {
	var themeConfig = config.read().themes,
		themeDir = path.join(themeConfig.directory, themeConfig.active),
		tmplPath = null;

	// A template is defined in the meta
	if (typeof headers.template !== 'undefined') {
		var p = path.join(themeDir, headers.template);
		if (fs.existsSync(p)) {
			tmplPath = p;
		}
	}

	// Try to load a type specific template
	if (tmplPath === null) {
		var p = path.join(themeDir, type + '.' + templateExt);
		if (fs.existsSync(p)) {
			tmplPath = p;
		}
	}

	// Load the default template
	if (tmplPath === null) {
		var p = path.join(themeDir, 'index.' + templateExt);
		if (fs.existsSync(p)) {
			tmplPath = p;
		}
	}

	if (tmplPath !== null) {
		return util.compileTmlpFile(p);
	} else {
		throw new Error('No template found.');
	}
};

// Get the permalink template
var getPermalinkTemplate = function(type) {
	var permalink = config.read().types[type].permalinks;
	return util.handlebars.compile(permalink || '{{slug}}.html');
};

module.exports = {
	getMeta : getMeta,
	getContent : getContent,
	getTemplate : getTemplate,
	getPermalinkTemplate : getPermalinkTemplate
};
