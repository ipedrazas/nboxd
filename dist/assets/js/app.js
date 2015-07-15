'use strict';
var nboxedApp = angular.module('nboxedApp',['ngRoute']);

// configure our routes
    nboxedApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'dockerweekly.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/kubeweekly', {
                templateUrl : 'KubeWeekly.html',
                controller  : 'mainController'
            })
             // route for the contact page
            .when('/containerweekly', {
                templateUrl : 'Containerweekly.html',
                controller  : 'mainController'
            });
    });

    nboxedApp.controller('mainController', function($scope) {
        $scope.message = 'Everyone come and see how good I look!';
    });
