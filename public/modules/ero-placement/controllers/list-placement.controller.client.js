'use strict';

angular.module('ero-placement').controller('EroPlacementListController', ['$rootScope', '$scope', '$http', '$location', 'ngDialog', '$window',
	function($rootScope, $scope, $http, $location, ngDialog, $window) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var findClientWithSpecifiedId = function(id) {
			for(var i = 0; i < $scope.clientList.length; i++) {
				if($scope.clientList[i]._id === id) {
					return $scope.clientList[i];
				}
			}
		};

		var matchLastPlacementWithClient = function() {
			for(var i = 0; i < $scope.resourceList.length; i++) {
				if($scope.resourceList[i].lastPlacement !== undefined && $scope.resourceList[i].lastPlacement !== null) {
					$scope.resourceList[i].lastPlacement.clientName = findClientWithSpecifiedId($scope.resourceList[i].lastPlacement.client).name;
				}
			}
		};

		var retrieveClientList = function() {
			$scope.placementListPromise = $http({method: 'GET', url:'api/client'}).
				success(function(clientList) {
		  			$scope.clientList = clientList;

		  			matchLastPlacementWithClient();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var retrieveResourceList = function() {
		    $scope.placementListPromise = $http({method: 'GET', url:'api/resource'}).
				success(function(resourceList) {
		  			$scope.resourceList = resourceList;

		  			retrieveClientList();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var doMigration = function(aResource) {
			$http({method: 'GET', url:'/api/performance/migration/resource/'+ aResource._id}).
				success(function() {
					retrieveResourceList();
				}).
				error(function(err) {
					$scope.error = err.data.message;
				}
			);
		};

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function () {
			retrieveResourceList();
		};

		$scope.detailPlacements = function(aResource) {
			$location.url('/ero/placement/resource/' + aResource._id);
		};

		$scope.timesheet = function(aResource) {
			$location.url('/ero/timesheet/' + aResource._id);
		};

		$scope.performance = function(aResource) {
			$location.url('/ero/performance/' + aResource._id);
		};

		$scope.projectList = function(aResource) {
			$location.url('/ero/project-list/' + aResource._id);
		};

		$scope.migration = function(aResource) {
			doMigration(aResource);
		};

		$scope.newExternalPlacement = function(aResource) {
			ngDialog.open({
			    template: '/modules/ero-placement/views/external-placement.view.client.html',
			    controller: 'ExternalPlacementController',
			    data: JSON.stringify({
			    	aResource: aResource
			    })
			});
		};

		$scope.newInternalPlacement = function(aResource) {
			ngDialog.open({
			    template: '/modules/ero-placement/views/internal-placement.view.client.html',
			    controller: 'InternalPlacementController',
			    data: JSON.stringify({
			    	aResource: aResource
			    })
			});
		};

		$scope.timesheetCollection = function(aResource) {
			ngDialog.open({
			    template: '/modules/ero-placement/views/create-performance-for-penilaian-user-and-timesheet-collection.view.client.html',
			    controller: 'CreatePerformanceController',
			    data: JSON.stringify({
			    	aResource: aResource
			    })
			});
		};

		$scope.persistensi = function(aResource) {
			ngDialog.open({
				template: '/modules/ero-placement/views/list-coorporate-event-view.client.html',
				controller: 'EroListEventController',
				data: JSON.stringify({
					aResource: aResource
				})
			});
		};

		// =====================================================================
		// Event listener
		// =====================================================================
		$rootScope.$on('ngDialog.closed', function (e, $dialog) {
			retrieveResourceList();
		});
	}
]);
