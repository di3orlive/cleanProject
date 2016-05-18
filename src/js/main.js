'use strict';
var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('mainCtrl', ['$scope', function ($scope) {

}]);

app.controller('homeCtrl', ['$scope', function ($scope) {
    $scope.tab = 1;

    $scope.setTab = function (newTab) {
        $scope.tab = newTab;
    };
    $scope.isTab = function (tab) {
        return $scope.tab === tab;
    };
}]);