'use strict';

// Setting up route
angular.module('ero-placement').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('ero-placement--list-placement', {
				url: '/ero/placement',
				templateUrl: 'modules/ero-placement/views/list-placement.view.client.html',
				needRole: 'ero'
			}).
			state('ero-placement--detail-placements', {
				url: '/ero/placement/resource/:resourceId',
				templateUrl: 'modules/ero-placement/views/detail-placements.view.client.html',
				needRole: 'ero'
			}).state('ero-placement--performance', {
				url: '/ero/performance/:resourceId',
				templateUrl: 'modules/ero-placement/views/performance.view.client.html',
				needRole: 'ero'
			}).state('ero-placement--project-list', {
				url: '/ero/project-list/:resourceId',
				templateUrl: 'modules/ero-placement/views/list-project.view.client.html',
				needRole: 'ero'
			});
	}
]);
