/**
 * Contains all application endpoints
 */

import APIController from './controllers/APIController';

export default {
	'/history/:num': {
		get: {
			method: APIController.history,
			public: true,
		},
	},
	'/history': {
		get: {
			method: APIController.history,
			public: true,
		},
	},
	'/translate/:destinationLanguageCode/:sourceText': {
		get: {
			method: APIController.translate,
			public: true,
		},
	},
};
