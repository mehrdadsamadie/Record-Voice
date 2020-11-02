MyApp.factory("counter", ['localStorageService', function (localStorageService) {
    var _counter = localStorageService.get('counter');
    return {
        counter: _counter != undefined ? _counter.counter : 0,
    }
}]);
MyApp.run(function ($rootScope, $interval) {
    $rootScope.AssignedDate = Date; // 'Date' could be assigned too of course:)

    $interval(function () {
        // nothing is required here, interval triggers digest automaticaly
    }, 1000)
});
MyApp.factory("date", ['$interval', '$rootScope', function ($interval, $rootScope) {
    var date;
    var tick = function () {

        date = Date.now();

    }
    tick();

    $interval(tick, 1000);
    return {
        Date: date
    }
}]);