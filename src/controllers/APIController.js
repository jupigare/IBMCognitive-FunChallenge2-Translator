import APIService from '../services/APIServiceMine';
var credentials = APIService.credentials();

var watson = require('watson-developer-cloud');
var tone_analyzer = watson.tone_analyzer(credentials.tone);
var language_translator = watson.language_translator(credentials.translate);

var Cloudant = require('cloudant');
var cloudant = Cloudant({account:credentials.db.username, password:credentials.db.password});
cloudant.db.list(function(err, allDbs) {
	console.log('Successfully connected to Cloudant DB');
	console.log('All my databases: %s', allDbs.join(', '));
});
var translateHistory = cloudant.db.use('translateHistory');

export default {
	history,
	translate
};

function history(req, res) {
	//To Add: retrieve history from Cloudant NoSQL DB
	var result = "History results here.";
	res.json(result);
}
function translate(req, res) {
	console.log("Source String:", req.params.sourceText);
	console.log("Dest Language:", req.params.destinationLanguageCode);
	language_translator.translate({
		text: req.params.sourceText,
		source: 'en',
		target: req.params.destinationLanguageCode 
		}, async function (err, translation) {
			// var result = translation;
			if (err) {
				console.log('translate() error:', err);
				var result = {'error':err};
			} else {
				var sourceTextTone = await toneAnalyze(req.params.sourceText);
				var translatedText = translation.translations[0].translation;
				var translatedTextTone = await toneAnalyze(translatedText);
				var result = {
					'sourceTextTone':sourceTextTone,
					'translatedText':translatedText,
					'translatedTextTone':translatedTextTone
				};
				// To Add: write results data to Cloundant NoSQL DB
			}
			res.json(result);
		}
	);
}

function toneAnalyze(text,tones='social') {
	return new Promise((resolve,reject) => {
		tone_analyzer.tone(
			{text:text, tones:tones},
			function(err, tone) {
				if (err) {
					console.log('toneAnalyze() error:', err);
					reject({'error':err});
				} else {
					resolve(tone.document_tone.tone_categories[0].tones);
				}
				return;
			}
		)
	});		
}