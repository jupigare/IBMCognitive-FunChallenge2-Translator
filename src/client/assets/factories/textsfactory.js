app.factory('TextsFactory', ['$http', function($http) {
	console.log("TextsFactory loaded.");

	function TextsFactory() {
		this.history = function(num,callback) {
			console.log("(factory) Attempting to retrieve history...");
			// callback("hello");
			$http.get('/api/v1/history/'+num).then(function(res) {
				console.log("GET /history succeeded with result", res.data);
				if (callback && typeof(callback)=="function") {
					callback(res.data);
				}
			}, function(res) {
				console.log("GET /history failed.");
				console.log("res:",res.error);
			})
		};

		this.translate = function(text, language, callback) {
			console.log(`(factory) Attempting to translate "${text}" into ${language}...`);
			var config = {params: {sourceText:text, destinationLanguageCode:language}};
			$http.get('/api/v1/translate', config).then(function(res) {
				console.log("GET /translate succeeded");
				if (callback && typeof(callback)=="function") {
					callback(res.data);
				}
			}, function(res) {
				console.log("GET /translate failed with error:",res.error);
			})
		};
	}

	return new TextsFactory();
}])
