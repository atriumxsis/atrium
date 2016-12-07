'use strict';

angular.module('ero-timesheet-template').controller('EroTimesheetTemplateListController', ['$scope', '$http',
	function($scope, $http) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var retrieveYearList = function() {
			$scope.yearListPromise = $http({method: 'GET', url:'api/timesheet-template/retrieve-years'}).
				success(function(yearList) {
        		  	$scope.yearList = yearList;
        		  	selectYear();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var selectYear = function() {
			$scope.selectedYear = null;

			for(var i = 0; i < $scope.yearList.length; i++) {
				if($scope.yearList[i].currentYear) {
					$scope.selectedYear = $scope.yearList[i];
				}
			}
		};

		var retrieveTimesheetTempateById = function(id) {
			$scope.timesheetTemplatePromise = $http({method: 'GET', url:'api/timesheet-template/' + id}).
				success(function(timesheetTemplate) {
        		  	$scope.timesheetTemplate = timesheetTemplate;
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var initiateStatusList = function() {
			$scope.statusList = ['Masuk', 'Libur', 'Cuti'];
		};

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function() {
			initiateStatusList();
			retrieveYearList();
		};

		$scope.updateTimesheetTemplate = function() {
			$scope.timesheetTemplatePromise = $http.post('api/timesheet-template/', $scope.timesheetTemplate).
				success(function() {
					retrieveTimesheetTempateById($scope.timesheetTemplate._id);
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		// =====================================================================
		// Event listener
		// =====================================================================
		$scope.$watch('selectedYear', function() {
			if($scope.selectedYear !== undefined && $scope.selectedYear !== null) {
				var id = $scope.selectedYear._id;

				retrieveTimesheetTempateById(id);
			}
		}, true);
	}
]);
