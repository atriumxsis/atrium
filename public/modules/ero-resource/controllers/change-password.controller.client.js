'use strict';

angular.module('ero-resource').controller('ChangePasswordResourceController', ['$scope', '$http', 
	function($scope, $http) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var init = function() {
			$scope.resource = $scope.ngDialogData.resource;
			$scope.passwordDetails = {
				userId: $scope.resource._id,
				newPassword: null
			};
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================		
		$scope.simpan = function() {
			$scope.formPromise = $http.post('api/resource/change-password', $scope.passwordDetails).
				success(function(result) {
					$scope.closeThisDialog();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);

		};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
