'use strict';

angular.module('ero-timesheet').controller('EroFormTimesheetController', ['$scope', '$http', '$stateParams', 'DateConverterUtils',
	function($scope, $http, $stateParams, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var onboardDateTimeline = [];

		var orderPlacementListByDate = function(placementList) {
			placementList.sort(function(placement1, placement2) {
				var placement1_fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placement1.fromDateReal_asString);
				var placement2_fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placement2.fromDateReal_asString);

				return (placement1_fromDateReal_asDate.getTime() - placement2_fromDateReal_asDate.getTime());
			});
		};

		var generateOnboardDateTimeline = function(placementList) {
			orderPlacementListByDate(placementList);

			if(placementList.length > 0) {
				for(var i = 0; i < placementList.length; i++) {
					onboardDateTimeline.push({
						onboardDate: DateConverterUtils.convertFromStringToDate(placementList[i].fromDateReal_asString), 
						placementData: placementList[i]
					});
				}

				// Assign last timeline
				if(placementList[placementList.length - 1].client.external) {
					onboardDateTimeline.push({
						onboardDate: DateConverterUtils.convertFromStringToDate(placementList[placementList.length - 1].toDate_asString), 
						placementData: placementList[placementList.length - 1]});
				} else {
					onboardDateTimeline.push({
						onboardDate: new Date(),
						placementData: placementList[placementList.length - 1]});
				}

				// Add 1 milisecond to last onboardDateTimeline. Important for matchingPlacementData() function
				onboardDateTimeline[onboardDateTimeline.length - 1].onboardDate = new Date(onboardDateTimeline[onboardDateTimeline.length - 1].onboardDate.getTime() + 1);
			}
		};

		var matchingPlacementData = function() {
			$scope.matchedPlacement = null;
			var tanggalTimesheet = $scope.tanggal_asDate;

			for(var i = 0; i < onboardDateTimeline.length - 1; i++) {
				if(onboardDateTimeline[i].onboardDate.getTime() <= tanggalTimesheet.getTime() && tanggalTimesheet.getTime() < onboardDateTimeline[i + 1].onboardDate.getTime()) {
					$scope.matchedPlacement = onboardDateTimeline[i].placementData;
					return;
				}
			}
		};

		var updateTimesheet = function() {
			if($scope.timesheet.statusAbsensi !== 'Masuk') {
				$scope.timesheet.jamKerjaMulai = null;
				$scope.timesheet.jamKerjaSelesai = null;
				$scope.timesheet.jamOTMulai = null;
				$scope.timesheet.jamOTSelesai = null;
			}

			$scope.formPromise = $http.post('api/timesheet/' + $stateParams.resourceId + '/update', $scope.timesheet).
				success(function(timesheet) {
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
			// Placement list related
			$scope.placementList = $scope.ngDialogData.placementList;
			generateOnboardDateTimeline($scope.placementList);

			// Timesheet related
			$scope.timesheet = $scope.ngDialogData.timesheet;
			$scope.tanggal_asDate = DateConverterUtils.convertFromStringToDate($scope.timesheet.tanggal_asString);
		};

		$scope.init();

		$scope.simpan = function() {
			if($scope.matchedPlacement !== null) {
				$scope.timesheet.placement = $scope.matchedPlacement._id;

				updateTimesheet();
			}
		};

		// =====================================================================
		// Event listener
		// =====================================================================
		$scope.$watch('tanggal_asDate', function() {
			if($scope.placementList !== null && $scope.placementList !== undefined) {
				matchingPlacementData();
			}
		}, true);
	}
]);
