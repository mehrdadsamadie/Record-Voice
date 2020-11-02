var MyApp = angular.module('MyApp', ["ui.router", "ngAnimate","LocalStorageModule"]);
MyApp.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('Recorde');
}]);
MyApp.config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
function ($stateProvider, $urlRouterProvider, $urlMastcherFactoryProvider) {
    $urlRouterProvider
        .otherwise('/');
    $stateProvider
          .state('home', {
              url: "/home",
              templateUrl: "angularJs/views/home/home.html",
              controller: "homeCtrl",
          })
    $urlRouterProvider.otherwise('/home');
}]);

MyApp.run(function ($rootScope, $location, $state, $window) {
    var history = [];
    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };
});

