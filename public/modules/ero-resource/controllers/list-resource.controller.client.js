'use strict';

angular.module('ero-resource').controller('EroResourceListController', ['$rootScope', '$scope', '$http', 'ngDialog',
	function($rootScope, $scope, $http, ngDialog) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var retrieveResourceList = function() {
		    $scope.resourceListPromise = $http({method: 'GET', url:'api/resource'}).
				success(function(resourceList) {
		  			$scope.resourceList = resourceList;
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

		$scope.openTambahResourceDialog = function() {
			ngDialog.open({
			    template: '/modules/ero-resource/views/form-resource.view.client.html',
			    controller: 'FormResourceController',
			    data: JSON.stringify({
			    	dialogTitle: 'Tambah Resource'
			    })
			});
		};

		$scope.openEditResourceDialog = function(resource) {
			ngDialog.open({
			    template: '/modules/ero-resource/views/form-resource.view.client.html',
			    controller: 'FormResourceController',
			    data: JSON.stringify({
			    	dialogTitle: 'Edit Resource',
			    	resource: resource
			    })
			});
		};

		$scope.openChangePasswordResourceDialog = function(resource) {
			ngDialog.open({
			    template: '/modules/ero-resource/views/change-password.view.client.html',
			    controller: 'ChangePasswordResourceController',
			    data: JSON.stringify({
			    	resource: resource
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
