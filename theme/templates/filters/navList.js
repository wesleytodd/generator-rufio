module.exports = function(options) {

	// Defaults
	options.items = options.items || [];
	options.limit = options.limit || 10;
	options.classes = options.classes || '';

	// Sort in reverse cron order
	options.items.sort(function(a, b) {
		return b.meta('date') - a.meta('date');
	});

	// Generate markup
	var out = '<nav class="' + options.classes + '"><ul>';
	var c = 0;
	for (var i in options.items) {
		if (i < options.limit && this.config.get('ENVIRONMENT') == 'dev' || options.items[i].meta('status') == 'Published') {
			out += '<li><a href="' + options.items[i].meta('permalink') + '">' + options.items[i].meta('title') + '</a></li>';
			c++;
		}
	}
	out += '</ul></nav>';

	// Return string
	return out;
};
