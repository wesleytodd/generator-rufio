module.exports = function(pages, classes) {
	var out = '<nav class="' + classes + '"><ul>';
	for (var i in pages) {
		out += '<li><a href="' + pages[i].permalink + '">' + pages[i].meta.title + '</a></li>';
	}
	out += '</ul></nav>';
	return out;
};
