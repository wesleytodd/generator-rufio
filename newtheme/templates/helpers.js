module.exports = function(handlebars) {
	
	handlebars.registerHelper('navList', function(pages, id) {
		var out = '<nav id="' + id + '"><ul>';
		for (var i in pages) {
			out += '<li><a href="/' + pages[i].permalink + '">' + pages[i].meta.title + '</a></li>';
		}
		out += '</ul></nav>';
		return new handlebars.SafeString(out);
	});

};
