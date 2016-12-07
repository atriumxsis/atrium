'use strict';

angular.module('ero-timesheet').controller('EroTimesheetListController', ['$rootScope', '$scope', '$http', '$stateParams', '$location', 'ngDialog', 'DateConverterUtils',
	function($rootScope, $scope, $http, $stateParams, $location, ngDialog, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var generateMonthDataList = function() {
			$scope.monthDataList = [];
			var monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ];

			var today = new Date();
			var month = today.getMonth();
			var year = today.getFullYear();

			$scope.monthDataList.push({
				name: year + ', ' + monthNames[month],
				year: year,
				month: month
			});

			for(var i = 0; i < 23; i++) {
				month = month - 1;

				if(month < 0) {
					month = 11;
					year = year - 1;
				}

				$scope.monthDataList.push({
					name: year + ', ' + monthNames[month],
					year: year,
					month: month
				});
			}
		};

		var findPlacementForSpecifiedId = function(placementList, id) {
			for(var i = 0; i < placementList.length; i++) {
				if(placementList[i]._id === id) {
					return placementList[i];
				}
			}

			return null;
		};

		var isTimesheetEditable = function(tanggalTimesheet) {
			return true;
		};

		var matchingTimesheetWithPlacement = function(timesheetList, placementList) {
			for(var i = 0; i < timesheetList.length; i++) {
				timesheetList[i].placement = findPlacementForSpecifiedId(placementList, timesheetList[i].placement);
				timesheetList[i].editable = isTimesheetEditable(timesheetList[i].tanggal_asDate);
			}
		};

		var retrieveInitData = function() {
		    $scope.timesheetListPromise = $http({method: 'GET', url:'api/placement/resource/' + $stateParams.resourceId}).
				success(function(placementList) {
		  			$scope.placementList = placementList;

		  			generateMonthDataList();
		  			$scope.selectedMonthData = $scope.monthDataList[0];
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var retrieveTimesheetByMonth = function(year, month){
			$scope.timesheetListPromise = $http({method: 'GET', url:'api/timesheet/' + $stateParams.resourceId + '/retrieve-by-month/', params: {year: year, month: month}}).
				success(function(timesheetList) {
					for(var i = 0; i < timesheetList.length; i++) {
		  				timesheetList[i].tanggal_asDate = DateConverterUtils.convertFromStringToDate(timesheetList[i].tanggal_asString);
		  			}

					matchingTimesheetWithPlacement(timesheetList, $scope.placementList);

        		  	$scope.timesheetList = timesheetList;
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var retrieveTimesheet = function() {
			if($scope.selectedMonthData !== undefined && $scope.selectedMonthData !== null) {
				retrieveTimesheetByMonth($scope.selectedMonthData.year, $scope.selectedMonthData.month);
			}
		};

		var retrieveResourceData = function() {
			$scope.resourcePromise = $http({method: 'GET', url:'api/resource/' + $stateParams.resourceId }).
				success(function(resource) {
        		  	$scope.resource = resource;
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function() {
			retrieveInitData();
			retrieveResourceData();
		};

		$scope.openEditTimesheetDialog = function(timesheet) {
			ngDialog.open({
			    template: '/modules/ero-timesheet/views/form-timesheet.view.client.html',
			    controller: 'EroFormTimesheetController',
			    data: JSON.stringify({
			    	placementList: $scope.placementList,
			    	timesheet: timesheet
			    })
			});
		};

		$scope.openDetailTimesheetDialog = function(timesheet) {
			ngDialog.open({
			    template: '/modules/ero-timesheet/views/detail-timesheet.view.client.html',
			    controller: 'EroDetailTimesheetController',
			    data: JSON.stringify({
			    	timesheet: timesheet
			    })
			});
		};

		$scope.openPrintTimesheetDialog = function() {
			ngDialog.open({
			    template: '/modules/ero-timesheet/views/print-timesheet.view.client.html',
			    controller: 'EroPrintTimesheetController'
			});
		};

		// =====================================================================
		// Event listener
		// =====================================================================
		$rootScope.$on('ngDialog.closed', function (e, $dialog) {
			retrieveTimesheet();
		});

		$scope.$watch('selectedMonthData', function() {
			retrieveTimesheet();
		}, true);
	}
]);
