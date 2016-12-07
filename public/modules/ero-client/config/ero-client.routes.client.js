'use strict';

// Setting up route
angular.module('ero-client').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('ero-client-list', {
				url: '/ero/client',
				templateUrl: 'modules/ero-client/views/list-client.view.client.html',
				needRole: 'ero'
			});
	}
]);
