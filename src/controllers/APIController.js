import APIService from '../services/APIServiceMine';
const credentials = APIService.credentials();

const watson = require('watson-developer-cloud');

const toneAnalyzer = watson.tone_analyzer(credentials.tone);
const languageTranslator = watson.language_translator(credentials.translate);

require('dotenv').load();

const Cloudant = require('cloudant');
const cloudant = Cloudant(
  {
    account: process.env.cloudant_username,
    password: process.env.cloudant_password,
  }
);
const db = cloudant.db.use('translatehistory');

const languages = {
  en: 'English',
  es: 'Spanish',
  po: 'Portuguese',
  fr: 'French',
  ge: 'German',
  it: 'Italian',
  ar: 'Arabic',
};

export default {
  history,
  translate,
};

function history(req, res) {
  // Retrieve history from Cloudant NoSQL DB
  const num = req.params.num || 5;
  db.list(
    {
      descending: true,
      limit: num,
      include_docs: true,
    },
    function (err, data) {
      if (err) {
        console.log('Error retrieving history:', err);
        const result = err;
        res.render('index', {data: result});
      } else {
        console.log(`Successfully retrieved history (${num} entries)`);
        var result = [];
        for (var i=0; i<data.rows.length; i++) {
          result.push({
            sourceText: data.rows[i].doc.sourceText,
            destinationLanguage: languages[data.rows[i].doc.destinationLanguageCode],
            translatedText: data.rows[i].doc.translatedText,
          });
        }
        res.render('index', {data: result});
      }
    }
  );
}
function translate(req, res) {
  const inputs = req.query || req.params;
  console.log('Inputs:', inputs.sourceText, inputs.destinationLanguageCode);
  languageTranslator.translate(
    {
      text: inputs.sourceText,
      source: 'en',
      target: inputs.destinationLanguageCode,
    },
    async function (err, translation) {
      if (err) {
        console.log('translate() error:', err);
        const result = {error: err};
        res.render('results', {data: result});
      } else {
        var sourceTextTone = await tone(inputs.sourceText);
        const translatedText = translation.translations[0].translation;
        const output = {
          sourceText: inputs.sourceText,
          destinationLanguageCode: inputs.destinationLanguageCode,
          translatedText: translatedText,
        };
        var translatedTextTone = await tone(translatedText);

        // Adds document if it doesn't exist yet in DB
        db.find({ selector:output, }, function(err, data) {
            if (err||data.docs.length==0) {
              console.log('Did not locate translation; attempting to add...');
              // If doesn't exist, write translation data to Cloundant NoSQL DB
              db.insert(output,
                function (err, body) {
                  if (err) {
                    console.log('Error adding to db:', err);
                    const result = {error: err};
                    res.render('results', {data: result});
                  } else {
                    console.log('Successfully added translation to db');
                  }
                }
              );
            } else {
              console.log('Translation already exists in db; will not attempt to add');
            }
        });
        const result = {
          sourceTextTone: sourceTextTone,
          sourceText: inputs.sourceText,
          destinationLanguage: languages[inputs.destinationLanguageCode],
          translatedText: translatedText,
          translatedTextTone: translatedTextTone,
        };
        res.render('results', {data: result});
      }
    }
  );
}

function tone (text, tones='social') {
  return new Promise((resolve, reject) => {
    toneAnalyzer.tone(
      {
        text: text, 
        tones: tones,
      },
      function (err, result) {
        if (err) {
          console.log('toneAnalyze() error:', err);
          reject({error: err});
        } else {
          resolve(result.document_tone.tone_categories[0].tones);
        }
        return;
      }
    );
  });
}
