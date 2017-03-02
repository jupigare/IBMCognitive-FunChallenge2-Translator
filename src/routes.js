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
	// '/translate/?sourceText=:sourceText&destinationLanguageCode=:destinationLanguageCode': {
	// '/translate/:destinationLanguageCode/:sourceText': {
	// '/translate/:sourceText/:destinationLanguageCode': {
	// 	get: {
	// 		method: APIController.translate,
	// 		public: true,
	// 	},
	// },
	'/translate*': {
		get: {
			method: APIController.translate,
			public: true,
		},
	},
	'/translate': {
		get: {
			method: APIController.translate,
			public: true,
		},
	},
};
