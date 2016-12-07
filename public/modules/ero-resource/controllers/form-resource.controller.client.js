'use strict';

angular.module('ero-resource').controller('FormResourceController', ['$scope', '$http', 'DateConverterUtils',
	function($scope, $http, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var createNewResource = function() {
			$scope.formPromise = $http.post('api/resource', $scope.resource).
				success(function(result) {
					$scope.closeThisDialog();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var updateResource = function() {
			$scope.formPromise = $http.post('api/resource/update', $scope.resource).
				success(function(resource) {
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


			if($scope.ngDialogData.resource !== undefined && $scope.ngDialogData.resource !== null) {
				$scope.editMode = true;
				$scope.resource = $scope.ngDialogData.resource;
			} else {
				$scope.resource = {
					_id: null,
					name: null,
					nip: null,
					email: null,
					password: null,
					joinDate_asString: DateConverterUtils.convertFromDateToString(new Date())
				};
			}

			$scope.resource.aktif = true;
			$scope.joinDate_asDate = DateConverterUtils.convertFromStringToDate($scope.resource.joinDate_asString);

			if($scope.resource.statusKepegawaian && $scope.resource.statusKepegawaian[0] === 'resign') {
				$scope.resource.aktif = false;
			}
		};

		$scope.init();

		$scope.simpan = function() {
			$scope.resource.joinDate_asString = DateConverterUtils.convertFromDateToString($scope.joinDate_asDate);
			if($scope.resource.aktif) {
				$scope.resource.statusKepegawaian = ['active'];
			} else {
				$scope.resource.statusKepegawaian = ['resign'];
			}

			if($scope.editMode) {
				updateResource();
			} else {
				createNewResource();
			}
		};

		$scope.openJoinDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened = !$scope.opened;
	  	};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
