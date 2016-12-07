'use strict';

// Setting up route
angular.module('timesheet').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('resource-home', {
				url: '/resource/home',
				templateUrl: 'modules/resource-home/views/home.view.client.html',
				needRole: 'resource'
			});
	}
]);
