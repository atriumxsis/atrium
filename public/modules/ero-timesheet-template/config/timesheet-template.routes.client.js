'use strict';

// Setting up route
angular.module('ero-timesheet-template').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('ero-timesheet-template', {
				url: '/ero/timesheet-template',
				templateUrl: 'modules/ero-timesheet-template/views/list-timesheet-template.view.client.html',
				needRole: 'ero'
			});
	}
]);
