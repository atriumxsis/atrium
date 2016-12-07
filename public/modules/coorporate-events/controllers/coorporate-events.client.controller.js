'use strict';

// Coorporate events controller
angular.module('coorporate-events').controller('CoorporateEventsController', ['$rootScope', '$scope', '$http', 'ngDialog',
	function($rootScope, $scope, $http, ngDialog) {

		// Find a list of Coorporate events
		var find = function() {
			//$scope.coorporateEvents = CoorporateEvents.query();
			$scope.eventListPromise = $http({method: 'GET', url:'api/coorporate-events'}).
				success(function(eventList) {
					$scope.coorporateEvents = eventList;
				}).
				error(function(err) {
					$scope.error = err.data.message;
				}
			);
		};

		$scope.prepare = function () {
			find();
		};

		$scope.openTambahEventDialog = function() {
			ngDialog.open({
				template: '/modules/coorporate-events/views/form-coorporate-event.client.view.html',
				controller: 'FormCoorporateEventController',
				data: JSON.stringify({
					dialogTitle: 'Tambah Event'
				})
			});
		};

		$scope.openEditEventDialog = function(aEvent) {
			ngDialog.open({
				template: '/modules/coorporate-events/views/form-coorporate-event.client.view.html',
				controller: 'FormCoorporateEventController',
				data: JSON.stringify({
					dialogTitle: 'Edit Event',
					aEvent: aEvent
				})
			});
		};

		$scope.openDeleteEventDialog = function(aEvent) {
			ngDialog.open({
				template: '/modules/coorporate-events/views/delete-coorporate-event.client.view.html',
				controller: 'FormCoorporateEventController',
				data: JSON.stringify({
					dialogTitle: 'Delete Event',
					aEvent: aEvent
				})
			});
		};

		// Create new Coorporate event
		//$scope.create = function() {
		//	// Create new Coorporate event object
		//	var coorporateEvent = new CoorporateEvents ({
		//		name: this.name
		//	});
        //
		//	// Redirect after save
		//	coorporateEvent.$save(function(response) {
		//		//$location.path('ero/coorporate-events/' + response._id);
		//		$location.path('ero/coorporate-events/');
        //
		//		// Clear form fields
		//		$scope.name = '';
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};

		// Remove existing Coorporate event
		//$scope.remove = function(coorporateEvent) {
		//	if ( coorporateEvent ) {
		//		coorporateEvent.$remove();
        //
		//		for (var i in $scope.coorporateEvents) {
		//			if ($scope.coorporateEvents [i] === coorporateEvent) {
		//				$scope.coorporateEvents.splice(i, 1);
		//			}
		//		}
		//	} else {
		//		$scope.coorporateEvent.$remove(function() {
		//			$location.path('ero/coorporate-events');
		//		});
		//	}
		//};
        //
		//// Update existing Coorporate event
		//$scope.update = function() {
		//	var coorporateEvent = $scope.coorporateEvent;
        //
		//	coorporateEvent.$update(function() {
		//		$location.path('ero/coorporate-events/' + coorporateEvent._id);
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};

		//// Find existing Coorporate event
		//$scope.findOne = function() {
		//	$scope.coorporateEvent = CoorporateEvents.get({
		//		coorporateEventId: $stateParams.coorporateEventId
		//	});
		//};

		$rootScope.$on('ngDialog.closed', function (e, $dialog) {
			find();
		});

	}
]);