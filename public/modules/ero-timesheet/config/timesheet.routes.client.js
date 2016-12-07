'use strict';

// Setting up route
angular.module('ero-timesheet').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('ero-timesheet', {
				url: '/ero/timesheet/:resourceId',
				templateUrl: 'modules/ero-timesheet/views/list-timesheet.view.client.html',
				needRole: 'ero'
			});
	}
]);
