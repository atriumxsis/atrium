'use strict';

// Setting up route
angular.module('ero-resource').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('ero-resource-list', {
				url: '/ero/resource',
				templateUrl: 'modules/ero-resource/views/list-resource.view.client.html',
				needRole: 'ero'
			});
	}
]);
