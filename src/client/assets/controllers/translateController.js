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
		// $scope.data = data;
    $scope.sourceText = data.sourceText;
    $scope.translatedText = data.translatedText;
    $scope.destinationLanguage = data.destinationLanguage;
		$scope.sourceTextTone = [
	    {
	      className: 'source',
	      axes: [
	        {axis: "Openness", value: data.sourceTextTone[0].score, yOffset: 10},
	        {axis: "Conscientiousness", value: data.sourceTextTone[1].score},
	        {axis: "Extraversion", value: data.sourceTextTone[2].score},
	        {axis: "Agreeableness", value: data.sourceTextTone[3].score},
	        {axis: "Emotional Range", value: data.sourceTextTone[4].score, xOffset: -20}
	      ]
	    }
  	];
	  $scope.translatedTextTone = [
	    {
	      className: 'translation',
	      axes: [
          {axis: "Openness", value: data.translatedTextTone[0].score, yOffset: 10},
          {axis: "Conscientiousness", value: data.translatedTextTone[1].score},
          {axis: "Extraversion", value: data.translatedTextTone[2].score},
          {axis: "Agreeableness", value: data.translatedTextTone[3].score},
          {axis: "Emotional Range", value: data.translatedTextTone[4].score, xOffset: -20}
	      ]
	    }
	  ];
	});

	$scope.goBack = function() {
		$location.url('/history');
	}
}])