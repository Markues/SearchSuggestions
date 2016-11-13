// Includes
let extend = require('util')._extend;
let request = require('request');

// Constants
let DEFAULTS = {
	suggestBasepath: 'http://path-to-gsa.com/suggest?',
	suggestParameters: {
		q: '',
		max: '5',
		site: 'example',
		client: 'example',
		format: 'rich'
	},
	avoidParameters: ['proxystylesheet']
};

// Constructors
function GSAProxy(basepath, parameters) {
	this.config = _copy(DEFAULTS);

	if (!_isUndefined(basepath)) {
		if (basepath.indexOf('/suggest?', 9) !== -1) {
			this.config.suggestBasepath = basepath;
		} else {
			this.config.suggestBasepath = basepath.substr(0, basepath.lastIndexOf('/')) + '/suggest?';
		}
	}
	if (!_isUndefined(parameters)) {
		this.config.inputParameters = extend(this.config.suggestParameters, parameters);
		this.config.suggestParameters.q = this.config.inputParameters.q;
	}
}

GSAProxy.prototype.executeSuggest = function(callback) {
	request(this.buildSuggestUrl(), function(err, res, body) {
		if (err) {
			callback(err);
		}

		callback(null, body);
	});
};

GSAProxy.prototype.buildSuggestUrl = function() {
	return this.config.suggestBasepath +
		_buildParameterString(this.config.suggestParameters, this.config.avoidParameters);
};

// Private Functions
function _buildParameterString(parameters, avoidParameters) {
	let parameterString = '';
	for (var key in parameters) {
		if (!_contains(avoidParameters, key)) {
			parameterString += '&' + key + '=' + parameters[key];
		}
	}
	return parameterString.substr(1);
}

function _contains(array, key) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === key) {
			return true;
		}
	}
	return false;
}

function _isUndefined(obj) {
	return typeof obj === 'undefined' || obj === null;
}

function _copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

// Module
module.exports = GSAProxy;
