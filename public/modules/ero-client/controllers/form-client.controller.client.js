'use strict';

angular.module('ero-client').controller('FormClientController', ['$scope', '$http', 
	function($scope, $http) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var createNewClient = function() {
			$scope.formPromise = $http.post('api/client', $scope.client).
				success(function(result) {
					$scope.closeThisDialog();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var updateClient = function() {
			$scope.formPromise = $http.post('api/client/update', $scope.client).
				success(function(client) {
					$scope.closeThisDialog();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		// =====================================================================
		// $scope Member
		// =====================================================================		
		$scope.init = function() {
			$scope.dialogTitle = $scope.ngDialogData.dialogTitle;

			if($scope.ngDialogData.client !== undefined && $scope.ngDialogData.client !== null) {
				$scope.editMode = true;
				$scope.client = $scope.ngDialogData.client;
			} else {
				$scope.client = {
					_id: null,
					name: null,
					external: true
				};
			}
		};

		$scope.init();

		$scope.simpan = function() {
			if($scope.editMode) {
				updateClient();
			} else {
				createNewClient();
			}
		};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
