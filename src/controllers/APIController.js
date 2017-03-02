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

const csrf = require('csurf');
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
  if (req.params.num) {
    const num = req.params.num;
  } else {
    const num = 5;
  }
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
      } else {
        console.log('Successfully retrieved history:', data);
        // const result = data;
        var result = [];
        for (var i=0; i<data.rows.length; i++) {
          result.push({
            sourceText: data.rows[i].doc.sourceText,
            destinationLanguage: languages[data.rows[i].doc.destinationLanguageCode],
            translatedText: data.rows[i].doc.translatedText,
          });
        }
        res.render('index', {data: result, csrfToken: csrf()});
      }
      // res.json(result);
    }
  );
}
function translate (req, res) {
  if (req.query) {
    const inputs = req.query;
  } else {
    const inputs = req.params;
  }
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
      } else {
        const sourceTextTone = await tone(inputs.sourceText);
        const translatedText = translation.translations[0].translation;
        // Write transation data to Cloundant NoSQL DB
        db.insert(
          {
            sourceText: inputs.sourceText,
            destinationLanguageCode: inputs.destinationLanguageCode,
            translatedText: translatedText,
          },
          function (err, body) {
          if (err) {
            console.log('Error adding to db:', err);
          } else {
            console.log(body);
          }
        });

        const translatedTextTone = await tone(translatedText);
        const result = {
          sourceTextTone: sourceTextTone,
          sourceText: inputs.sourceText,
          destinationLanguage: languages[inputs.destinationLanguageCode],
          translatedText: translatedText,
          translatedTextTone: translatedTextTone,
        };
        // console.log(result.sourceTextTone[0].tone_name, result.sourceTextTone[0].score, result.translatedTextTone[0].score);
        // console.log(result.sourceTextTone[1].tone_name, result.sourceTextTone[1].score, result.translatedTextTone[1].score);
        // console.log(result.sourceTextTone[2].tone_name, result.sourceTextTone[2].score, result.translatedTextTone[2].score);
        // console.log(result.sourceTextTone[3].tone_name, result.sourceTextTone[3].score, result.translatedTextTone[3].score);
        // console.log(result.sourceTextTone[4].tone_name, result.sourceTextTone[4].score, result.translatedTextTone[4].score);
      }
      res.render('results', {data: result});
      // res.json(result);
    }
  );
}

function tone (text, tones='social') {
  return new Promise((resolve,reject) => {
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
