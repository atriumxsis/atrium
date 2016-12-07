'use strict';

//Setting up route
angular.module('coorporate-events').config(['$stateProvider',
	function($stateProvider) {
		// Coorporate events state routing
		$stateProvider.
		state('listCoorporateEvents', {
			url: '/ero/coorporate-events',
			templateUrl: 'modules/coorporate-events/views/list-coorporate-events.client.view.html',
			needRole: 'ero'
		});
		//state('createCoorporateEvent', {
		//	url: '/ero/coorporate-events/create',
		//	templateUrl: 'modules/coorporate-events/views/form-coorporate-event.client.view.html',
		//	needRole: 'ero'
		//}).
		//state('viewCoorporateEvent', {
		//	url: '/ero/coorporate-events/:coorporateEventId',
		//	templateUrl: 'modules/coorporate-events/views/view-coorporate-event.client.view.html',
		//	needRole: 'ero'
		//}).
		//state('editCoorporateEvent', {
		//	url: '/ero/coorporate-events/:coorporateEventId/edit',
		//	templateUrl: 'modules/coorporate-events/views/edit-coorporate-event.client.view.html',
		//	needRole: 'ero'
		//});
	}
]);