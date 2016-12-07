'use strict';

angular.module('timesheet').controller('TimesheetListController', ['$rootScope', '$scope', '$http', '$location', 'ngDialog', 'DateConverterUtils',
	function($rootScope, $scope, $http, $location, ngDialog, DateConverterUtils) {
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
			var tanggalTimesheetAsDate = new Date(tanggalTimesheet);
			var currentAsDate = new Date();
			var aWeekAgoAsDate = new Date();
			aWeekAgoAsDate.setDate(currentAsDate.getDate() - 7);

			return (aWeekAgoAsDate <= tanggalTimesheetAsDate && tanggalTimesheetAsDate <= currentAsDate);
			// return true;
		};

		var matchingTimesheetWithPlacement = function(timesheetList, placementList) {
			for(var i = 0; i < timesheetList.length; i++) {
				timesheetList[i].placement = findPlacementForSpecifiedId(placementList, timesheetList[i].placement);
				timesheetList[i].editable = isTimesheetEditable(timesheetList[i].tanggal_asDate);
			}
		};

		var retrieveInitData = function() {
		    $scope.timesheetListPromise = $http({method: 'GET', url:'api/placement'}).
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
			$scope.timesheetListPromise = $http({method: 'GET', url:'api/timesheet/retrieve-by-month/', params: {year: year, month: month}}).
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

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function() {
			retrieveInitData();
		};

		$scope.openEditTimesheetDialog = function(timesheet) {
			ngDialog.open({
			    template: '/modules/resource-timesheet/views/form-timesheet.view.client.html',
			    controller: 'FormTimesheetController',
			    data: JSON.stringify({
			    	placementList: $scope.placementList,
			    	timesheet: timesheet
			    })
			});
		};

		$scope.openDetailTimesheetDialog = function(timesheet) {
			ngDialog.open({
			    template: '/modules/resource-timesheet/views/detail-timesheet.view.client.html',
			    controller: 'DetailTimesheetController',
			    data: JSON.stringify({
			    	timesheet: timesheet,
			    })
			});
		};

		// $scope.openPrintTimesheetDialog = function() {
		// 	$scope.timesheetListPromise = $http({method: 'GET', url:'api/project/retrieve'}).
		// 		success(function(projectList) {
		// 			if(projectList !== undefined && projectList !== null && projectList.length > 0) {
		// 				ngDialog.open({
		// 				    template: '/modules/resource-timesheet/views/print-timesheet.view.client.html',
		// 				    controller: 'PrintTimesheetController'
		// 				});
		// 			} else {
		// 				ngDialog.open({
		// 				    template: '<center><p>Mohon maaf, data project anda masih kosong.<br>' +
		// 				    		  ' Anda harus mengisi data project anda selama di Xsis agar dapat melakukan pencetakan timesheet.</p><br>' +
		// 				    		  '<button type="button" data-ng-click="redirectToProjectPage()" class="btn btn-info btn-xs">Goto Project Page</button></center>',
		// 				    plain: true,
		// 				    controller: ['$scope', '$location', function($scope, $location) {
		// 				        $scope.redirectToProjectPage = function() {
		// 				        	$scope.closeThisDialog();
		// 				        	$location.path("/resource/project");
		// 				        };
		// 				    }]
		// 				});
		// 			}
	 //    		}).
	 //    		error(function(err) {
	 //      			$scope.error = err.data.message;
	 //  			}
	 //  		);
		// };
		$scope.openPrintTimesheetDialog = function() {
			ngDialog.open({
			    template: '/modules/resource-timesheet/views/print-timesheet.view.client.html',
			    controller: 'PrintTimesheetController'
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
