﻿(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies','ngSanitize'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'template/login.view.html',
                controllerAs: 'vm'
            })
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'template/register.view.html',
                controllerAs: 'vm'
            })
            .when('/home', {
                controller: 'HomeController',
                templateUrl: 'template/home.view.html',
                controllerAs: 'vm'
            })
            .when('/orderHandleView', {
                controller: 'OrderHandleViewController',
                templateUrl: 'template/orderhandle.view.html',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        console.log('rsk refresh ');
        $rootScope.globals = $cookieStore.get('globals') || {};
        console.log('rsk refresh '+$rootScope.globals);
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register','/orderHandleView']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();