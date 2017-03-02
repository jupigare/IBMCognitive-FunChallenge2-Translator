var watson = require('watson-developer-cloud');

// ------------------------------------
// Exports
// ------------------------------------

const APIService = {
	tone_analyzer,
	language_translator,
};

decorate(APIService, 'APIService');

export default APIService;

var tone_analyzer = watson.tone_analyzer({
	username: "USERNAME",
	password: "PASSWORD",
  	version: 'v3',
  	version_date: '2016-05-19'
});
var language_translator = watson.language_translator({
	username: "USERNAME",
	password: "PASSWORD",
	version: 'v2',
	url: 'https://gateway.watsonplatform.net/language-translator/api/'
});
