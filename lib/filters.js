
var registeredFilters = {};

function registerFilter(name, filter) {
	registeredFilters[name] = filter;
}

function applyFilter() {
	
}

module.exports = {
	registerFilter : registerFilter,
	applyFilter : applyFilter
};
