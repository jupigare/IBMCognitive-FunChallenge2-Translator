var app = angular.module('app', ['ngRoute',]);
console.log("Angular module 'app' created.");

app.directive('radarCharts', function ( /* dependencies */ ) {
  // constants
  var radius = 4,
    minValue = 0,
    maxValue = 1,
    w=400,
    h=400;
  return {
    restrict: 'E', // directive will be invoked for <radar-charts>
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      scope.$watch('data',function (newVal,oldVal) {
        if (newVal === oldVal) {
            return;
        }
        if (newVal) {
          var myData = newVal;
          // console.log("Data to graph:",myData);
          var chart = RadarChart.chart();
          var svg = d3.select(element[0])
            .append("svg")
              .attr("width", w)
              .attr("height", h);
          svg.append('g').classed('focus', 1).datum(myData).call(chart);
        } else {
          console.log('Unable to graph data.');
        }
      });
    }
  };
});
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when ('/history/:num', {
      templateUrl: '../../partials/history.html',
      controller: 'textController'
    })
    .when ('/history', {
      templateUrl: '../../partials/history.html',
      // templateUrl: 'index.html',
      controller: 'textController'
    })
    .when ('/translate/:destinationLanguageCode/:sourceText', {
      templateUrl:'../../partials/translate.html',
      controller: 'translateController'
    })
    .otherwise ({
      redirectTo: '/history'
    });
        // $locationProvider.html5Mode(true);
});
