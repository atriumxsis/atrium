'use strict';

angular.module('timesheet').controller('PrintTimesheetController', ['$scope', 'DateConverterUtils',
	function($scope, DateConverterUtils) {
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
			var startDate_asString = DateConverterUtils.convertFromDateToString($scope.startDate_asDate);
			var endDate_asString = DateConverterUtils.convertFromDateToString($scope.endDate_asDate);

			var timesheetUrl = '/api/timesheet/retrieve-pdf/' + startDate_asString + '/' + endDate_asString;

			window.open(timesheetUrl, '_blank');
			
			$scope.closeThisDialog();
	  	};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
