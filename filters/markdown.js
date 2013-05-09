var registerFilter = require('../lib/filters').registerFilter,
	marked = require('marked');

registerFilter('meta', function(fileContent) {
	return marked(fileContent);
});
