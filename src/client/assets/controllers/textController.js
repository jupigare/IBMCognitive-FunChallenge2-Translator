app.controller("textController", ['TextsFactory', '$scope', '$route', '$routeParams', '$location', '$filter', 
function(TextsFactory, $scope, $route, $routeParams, $location, $filter) {
	// console.log("textController loaded.");
	var languages = {
		'es':"Spanish",
		'po':"Portuguese",
		'fr':"French",
		'ge':"German",
		'it':"Italian",
		'ar':"Arabic"
	};

	$scope.texts = [];
	var num = $routeParams.num || 5;
	TextsFactory.history(num,function(data) {
		for (var i in data) {
			$scope.texts.push(data[i]);
		}
	});


	$scope.translation = function() {
		// console.log("(angular textController) Translating text:", $scope.tr);
		$location.url(`/translate/${$scope.tr.destinationLanguageCode}/${$scope.tr.sourceText}`);
	}

	$scope.reset = function() {
		$route.reload()
	}
}])