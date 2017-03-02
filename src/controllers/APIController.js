import APIService from '../services/APIServiceMine';
var credentials = APIService.credentials();

var watson = require('watson-developer-cloud');
var tone_analyzer = watson.tone_analyzer(credentials.tone);
var language_translator = watson.language_translator(credentials.translate);

require('dotenv').load();
var Cloudant = require('cloudant');
var cloudant = Cloudant({account:process.env.cloudant_username, password:process.env.cloudant_password});
var db = cloudant.db.use('translatehistory');

export default {
	history,
	translate
};

function history(req, res) {
	// var result = "History results here.";
	//Retrieve history from Cloudant NoSQL DB
	// db.list(function(err, result) {
	db.list({descending:true, limit:req.params.num, include_docs:true}, function(err, data) {
		if (err) {
			console.log("Error retrieving history:", err);
			var result = err;
		} else {
			console.log("Successfully retrieved history:", data);
			var result = data;
		}
		res.json(result);
	});
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
				// Write results data to Cloundant NoSQL DB
				db.insert({sourceText: req.params.sourceText, destinationLanguageCode: req.params.destinationLanguageCode, translatedText:translatedText,}, function(err, body) {
					if (err) {
						console.log("Error adding to db:", err);
					} else {
						console.log(body);
					}
				})
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