'use strict';

// Setting up route
angular.module('timesheet').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
			state('timesheet', {
				url: '/resource/timesheet',
				templateUrl: 'modules/resource-timesheet/views/list-timesheet.view.client.html',
				needRole: 'resource'
			});
	}
]);
