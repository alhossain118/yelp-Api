'use strict';

var app = angular.module('myApp', ['ui.router', 'satellizer', 'btford.socket-io']);

app.run(function($rootScope, User) {
  $rootScope.currentUser = {};
  User.setCurrent();
});

app.config(function($authProvider) {
  $authProvider.loginUrl = '/api/users/login';
  $authProvider.signupUrl = '/api/users/signup';

  $authProvider.facebook({
    clientId: '1835801889974227',
    url: '/api/users/facebook'
  });
});

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', { url: '/', templateUrl: '/html/home.html' })
    .state('login', {
      url: '/login',
      templateUrl: '/html/login.html',
      controller: 'loginCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/html/register.html',
      controller: 'registerCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl',
      resolve: {
        Profile: function(User) {
          return User.getProfile();
        }
      }
    })
    .state('users', {
      url: '/users',
      templateUrl: '/html/users.html',
      controller: 'usersCtrl',
      resolve: {
        Users: function(User) {
          return User.getAll();
        }
      }
    })
    .state('searchYelp', {
      url: '/searchYelp',
      templateUrl: '/html/searchYelp.html',
      controller: 'searchYelpCtrl',
      resolve: {
        Profile: function(User) {
          return User.getProfile();
        }
      }
    })
    .state('business', {
      url: '/business/:businessId',
      templateUrl: '/html/business.html'
    })
    .state('business.info', {
      url: '/',
      templateUrl: '/html/businessInfo.html',
      controller:'businessInfoCtrl'
    })
    .state('savedBusinesses', {
      url: '/savedBusinesses',
      templateUrl: '/html/savedBusinesses.html',
      controller:'savedBusinessesCtrl',
      resolve: {
        Profile: function(User) {
          return User.getProfile();
        }
      }
    })

  $urlRouterProvider.otherwise('/');
});
