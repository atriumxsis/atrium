'use strict';

angular.module('ero-placement').controller('InternalPlacementController', ['$scope', '$http', 'DateConverterUtils',
	function($scope, $http, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var retrieveInternalClient = function() {
			$scope.placementPromise = $http.get('api/client/internal').
				success(function(clientList) {
					$scope.clientList = clientList;
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var isCreateMode = function() {
			return ($scope.ngDialogData.aPlacement === undefined || $scope.ngDialogData.aPlacement === null);
		};

		var init = function() {
			retrieveInternalClient();

			// Create Placement
			if(isCreateMode()) {
				$scope.placement = {
					user: $scope.ngDialogData.aResource._id,
					fromDateReal_asString: DateConverterUtils.convertFromDateToString(new Date()),
					timesheetCollectingDate: null,
					client: null,
					notes: null,
				};
			} else {
				$scope.placement = {
					placementId: $scope.ngDialogData.aPlacement._id,
					user: $scope.ngDialogData.aResource._id,
					fromDateReal_asString: $scope.ngDialogData.aPlacement.fromDateReal_asString,
					timesheetCollectingDate: $scope.ngDialogData.aPlacement.timesheetCollectingDate,
					client: $scope.ngDialogData.aPlacement.client._id,
					notes: $scope.ngDialogData.aPlacement.notes
				};
			}

			$scope.fromDateReal_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.fromDateReal_asString);
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.simpan = function() {
			$scope.placement.fromDateReal_asString = DateConverterUtils.convertFromDateToString($scope.fromDateReal_asDate);

			$scope.placementPromise = $http.post('api/placement', $scope.placement).
				success(function(result) {
					$scope.closeThisDialog();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		$scope.openFromDateReal = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.fromDateRealOpened = !$scope.fromDateRealOpened;
	  	};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
