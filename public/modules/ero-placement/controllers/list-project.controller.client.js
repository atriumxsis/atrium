'use strict';

angular.module('ero-placement').controller('ProjectListController', ['$rootScope', '$scope', '$http', '$stateParams', 'ngDialog', 'DateConverterUtils',
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

		var retrieveProjectList = function() {
			$scope.projectListPromise = $http({method: 'GET', url:'api/project/' + $stateParams.resourceId + '/retrieve'}).
				success(function(projectList) {
		  			$scope.projectList = projectList;
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
		  			retrieveProjectList();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};


		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function() {
			retrieveClientList();
		};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
