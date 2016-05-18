'use strict';
var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('mainCtrl', ['$scope', function ($scope) {

}]);

app.controller('homeCtrl', ['$scope', function ($scope) {

}]);