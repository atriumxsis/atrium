'use strict';

angular.module('ero-client').controller('EroClientListController', ['$rootScope', '$scope', '$http', 'ngDialog',
	function($rootScope, $scope, $http, ngDialog) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var retrieveClientList = function() {
		    $scope.clientListPromise = $http({method: 'GET', url:'api/client'}).
				success(function(clientList) {
		  			$scope.clientList = clientList;
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
			retrieveClientList();
		};

		$scope.openTambahClientDialog = function() {
			ngDialog.open({
			    template: '/modules/ero-client/views/form-client.view.client.html',
			    controller: 'FormClientController',
			    data: JSON.stringify({
			    	dialogTitle: 'Tambah Client'
			    })
			});
		};

		$scope.openEditClientDialog = function(client) {
			ngDialog.open({
			    template: '/modules/ero-client/views/form-client.view.client.html',
			    controller: 'FormClientController',
			    data: JSON.stringify({
			    	dialogTitle: 'Edit Client',
			    	client: client
			    })
			});
		};

		// =====================================================================
		// Event listener
		// =====================================================================
		$rootScope.$on('ngDialog.closed', function (e, $dialog) {
			retrieveClientList();
		});
	}
]);
