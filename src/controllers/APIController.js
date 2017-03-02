import API from '../services/APIService';
var tone_analyzer = API.tone_analyzer;
var language_translator = API.language_translator;

export default {
	history,
	translate
};

function history(req, res) {
	result = "History results here.";
	res.json(result);
}
function translate(req, res) {
	result = "Translate results here.";
	res.json(result);
}
