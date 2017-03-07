app.controller("translateController", ['TextsFactory', '$scope', '$route', '$routeParams', '$location', '$filter', 
function(TextsFactory, $scope, $route, $routeParams, $location, $filter) {
	// console.log("translateController loaded.");
	var languages = {
		'es':"Spanish",
		'po':"Portuguese",
		'fr':"French",
		'ge':"German",
		'it':"Italian",
		'ar':"Arabic"
	};

	TextsFactory.translate($routeParams.sourceText, $routeParams.destinationLanguageCode, function(data) {
		// console.log("(angular translateController) Translating text:", $scope.tr);
		// console.log("RESULTS:",data);
		$scope.data = data;
	});

	$scope.goBack = function() {
		$location.url('/history');
	}
}])