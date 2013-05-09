
var registeredFilters = {};

function registerFilter(name, filter) {
	registeredFilters[name] = filter;
}

function applyFilter(name, contents) {
	return registeredFilters[name](contents);
}

module.exports = {
	registerFilter : registerFilter,
	applyFilter : applyFilter
};
