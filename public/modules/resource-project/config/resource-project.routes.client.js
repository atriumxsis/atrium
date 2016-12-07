'use strict';

// Setting up route
angular.module('resource-project').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('resource-project-list', {
				url: '/resource/project',
				templateUrl: 'modules/resource-project/views/list.project.view.client.html',
				needRole: 'resource'
			});
	}
]);
