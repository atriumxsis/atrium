'use strict';

angular.module('ero-placement').controller('DetailPlacementsController', ['$rootScope', '$scope', '$http', '$stateParams', 'ngDialog', 'DateConverterUtils',
	function($rootScope, $scope, $http, $stateParams, ngDialog, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var searchClientWithSpecifiedId = function(clientId) {
			for(var i = 0; i < $scope.clientList.length; i++) {
				if($scope.clientList[i]._id === clientId) {
					return $scope.clientList[i];
				}
			}

			return null;
		};

		var constructClientNameForResource = function() {
			if($scope.resource.lastPlacement !== undefined && $scope.resource.lastPlacement !== null) {
				var client = searchClientWithSpecifiedId($scope.resource.lastPlacement.client);

				if(client !== null) {
					$scope.resource.lastPlacement.clientName = client.name;
				}
			}
		};

		var retrieveResourceInfo = function() {
			$scope.resourcePromise = $http({method: 'GET', url:'api/resource/' + $stateParams.resourceId}).
				success(function(resource) {
		  			$scope.resource = resource;

		  			constructClientNameForResource();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var retrievePlacementList = function() {
			$scope.placementListPromise = $http({method: 'GET', url:'api/placement/resource/' + $stateParams.resourceId}).
				success(function(placementList) {
	  				$scope.placementList = placementList;

	  				for(var i = 0; i < placementList.length; i++) {
	  					placementList[i].fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placementList[i].fromDateReal_asString);
	  				}
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var retrieveClientList = function() {
			$scope.clientListPromise = $http({method: 'GET', url:'api/client'}).
				success(function(clientList) {
		  			$scope.clientList = clientList;

		  			retrieveResourceInfo();
		  			retrievePlacementList();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var openExternalPlacementForm = function(aPlacement) {
			ngDialog.open({
			    template: '/modules/ero-placement/views/external-placement.view.client.html',
			    controller: 'ExternalPlacementController',
			    data: JSON.stringify({
			    	aResource: $scope.resource,
			    	aPlacement: aPlacement
			    })
			});
		};

		var openInternalPlacementForm = function(aPlacement) {
			ngDialog.open({
			    template: '/modules/ero-placement/views/internal-placement.view.client.html',
			    controller: 'InternalPlacementController',
			    data: JSON.stringify({
			    	aResource: $scope.resource,
			    	aPlacement: aPlacement
			    })
			});
		};

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function() {
			retrieveClientList();
		};

		$scope.editPlacement = function(aPlacement) {
			if(aPlacement.client.external) {
				openExternalPlacementForm(aPlacement);
			} else {
				openInternalPlacementForm(aPlacement);
			}
		};

		// =====================================================================
		// Event listener
		// =====================================================================
		$rootScope.$on('ngDialog.closed', function (e, $dialog) {
			console.log('Hello, aku di detail-placement');
			retrievePlacementList();
		});
	}
]);
