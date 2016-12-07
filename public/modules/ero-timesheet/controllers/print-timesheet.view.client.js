'use strict';

angular.module('ero-timesheet').controller('EroPrintTimesheetController', ['$scope', '$stateParams', 'DateConverterUtils',
	function($scope, $stateParams, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var init = function() {
			$scope.startDate_asDate = DateConverterUtils.todayAsDate();
			$scope.endDate_asDate = DateConverterUtils.todayAsDate();
		};

		init();
		
		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.openStartDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.startDateOpened = !$scope.startDateOpened;
	  	};

	  	$scope.openEndDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.endDateOpened = !$scope.endDateOpened;
	  	};

	  	$scope.printTimesheet = function() {
			// var startDate_asTime = $scope.startDate_asDate.getTime();
			// var endDate_asTime = $scope.endDate_asDate.getTime();
			// console.log(startDate_asString, endDate_asString);

			var startDate_asString = DateConverterUtils.convertFromDateToString($scope.startDate_asDate);
			var endDate_asString = DateConverterUtils.convertFromDateToString($scope.endDate_asDate);

			var timesheetUrl = '/api/timesheet/' + $stateParams.resourceId + '/retrieve-pdf/' + startDate_asString + '/' + endDate_asString;

			window.open(timesheetUrl, '_blank');

			$scope.closeThisDialog();
	  	};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
