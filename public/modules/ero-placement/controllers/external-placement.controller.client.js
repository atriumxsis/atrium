'use strict';

angular.module('ero-placement').controller('ExternalPlacementController', ['$scope', '$http', 'DateConverterUtils',
	function($scope, $http, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var retrieveExternalClient = function() {
			$scope.placementPromise = $http.get('api/client/external').
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
			retrieveExternalClient();

			// Create Placement
			if(isCreateMode()) {
				$scope.placement = {
					user: $scope.ngDialogData.aResource._id,
					prfNumber: null,
					fromDate_asString: DateConverterUtils.convertFromDateToString(new Date()),
					toDate_asString: DateConverterUtils.convertFromDateToString(new Date()),
					fromDateReal_asString: DateConverterUtils.convertFromDateToString(new Date()),
					timesheetCollectingDate: null,
					client: null,
					placementType: 'new',
					rumpunTechnology: null,
					location: null,
					notes: null
				};
			} 
			// Edit Placement
			else {
				$scope.placement = {
					placementId: $scope.ngDialogData.aPlacement._id,
					user: $scope.ngDialogData.aResource._id,
					prfNumber: $scope.ngDialogData.aPlacement.prfNumber,
					fromDate_asString: $scope.ngDialogData.aPlacement.fromDate_asString,
					toDate_asString: $scope.ngDialogData.aPlacement.toDate_asString,
					fromDateReal_asString: $scope.ngDialogData.aPlacement.fromDateReal_asString,
					timesheetCollectingDate: $scope.ngDialogData.aPlacement.timesheetCollectingDate,
					client: $scope.ngDialogData.aPlacement.client._id,
					placementType: $scope.ngDialogData.aPlacement.placementType[0],
					rumpunTechnology: $scope.ngDialogData.aPlacement.rumpunTechnology[0],
					location: $scope.ngDialogData.aPlacement.location,
					notes: $scope.ngDialogData.aPlacement.notes
				};
			}

			$scope.placementTypeList = ['new', 'extend', 'replace', 'pay absence'];
			$scope.rumpunTechnologyList = ['Java', '.NET', 'PHP', 'Other Developer', 'System Engineer', 'Other'];
			$scope.fromDate_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.fromDate_asString);
			$scope.toDate_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.toDate_asString);
			$scope.fromDateReal_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.fromDateReal_asString);
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.simpan = function() {
			$scope.placement.fromDate_asString = DateConverterUtils.convertFromDateToString($scope.fromDate_asDate);
			$scope.placement.toDate_asString = DateConverterUtils.convertFromDateToString($scope.toDate_asDate);
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

		$scope.openFromDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.fromDateOpened = !$scope.fromDateOpened;
	  	};

	  	$scope.openToDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.toDateOpened = !$scope.toDateOpened;
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
