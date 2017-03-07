var app = angular.module('app', ['ngRoute', 'ngMessages']);
console.log("Angular module 'app' created.");

app.config(function($routeProvider) {
	$routeProvider
		.when ('/history/:num', {
			templateUrl: 'partials/history.html',
			controller: 'textController'
		})
		.when ('/history', {
			templateUrl: 'partials/history.html',
			// templateUrl: 'index.html',
			controller: 'textController'
		})
		.when ('/translate/:destinationLanguageCode/:sourceText', {
			templateUrl:'partials/translate.html',
			controller: 'translateController'
		})
		.otherwise ({
			redirectTo: '/history'
		});
        // $locationProvider.html5Mode(true);
});
