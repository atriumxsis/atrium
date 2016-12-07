'use strict';

// Setting up route
angular.module('ero-home').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('ero-home', {
				url: '/ero/home',
				templateUrl: 'modules/ero-home/views/home.view.client.html',
				needRole: 'ero'
			});
	}
]);
