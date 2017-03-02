import API from '../services/APIService';
var tone_analyzer = API.tone_analyzer;
var language_translator = API.language_translator;

export default {
	history,
	translate
};

function history(req, res) {
	//To Add: retrieve history from Cloudant NoSQL DB
	result = "History results here.";
	res.json(result);
}
function translate(req, res) {
	console.log("Source String:", req.query.text);
	console.log("Dest Language:", req.query.language);
	language_translator.translate({
		text: req.query.text,
		source: 'en',
		target: req.query.language 
		}, async function (err, translation) {
			if (err) {
				console.log('translate() error:', err);
				var result = {'error':err};
			} else {
				var sourceTextTone = await toneAnalyze(req.query.text);
				var translatedText = translation.translations[0].translation;
				var translatedTextTone = await toneAnalyze(translatedText);
				var result = {
					'sourceTextTone':sourceTextTone,
					'translatedText':translatedText,
					'translatedTextTone':translatedTextTone
				};
				//To Add: write results data to Cloundant NoSQL DB
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