'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/signin.view.client.html',
			needRole: 'mustBeNotLogged'
		}).state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/change-password.view.client.html',
			needRole: 'mustBeLogged'
		});
	}
]);