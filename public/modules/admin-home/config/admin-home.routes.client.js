'use strict';

// Setting up route
angular.module('admin-home').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('admin-home', {
				url: '/admin/home',
				templateUrl: 'modules/admin-home/views/home.view.client.html',
				needRole: 'admin'
			});
	}
]);
