'use strict';

angular.module('timesheet').controller('ResourceHomeController', ['$scope', '$http', 'ngDialog',
	function($scope, $http, ngDialog) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var calculateTotalPerformance = function() {
			var totalAbsensi = 0;
			var totalBillable = 0;
			var totalTimesheetCollection = 0;
			var totalPenilaianUser = 0;
			var grandTotal = 0;

			for(var i = 0; i < $scope.performanceList.length; i++) {
				var aPerformance = $scope.performanceList[i];

				if(aPerformance.kriteriaPenilaianUser && aPerformance.kriteriaPenilaianUser.kriteriaValue) {
					totalPenilaianUser += aPerformance.kriteriaPenilaianUser.kriteriaValue;
				}
				if(aPerformance.kriteriaTimesheetCollection && aPerformance.kriteriaTimesheetCollection.kriteriaValue) {
					totalTimesheetCollection += aPerformance.kriteriaTimesheetCollection.kriteriaValue;
				}
				if(aPerformance.kriteriaPersistensi && aPerformance.kriteriaPersistensi.kriteriaValue) {
					totalAbsensi += aPerformance.kriteriaPersistensi.kriteriaValue;
				}
				if(aPerformance.kriteriaBillableUtilization && aPerformance.kriteriaBillableUtilization.kriteriaValue) {
					totalBillable += aPerformance.kriteriaBillableUtilization.kriteriaValue;
				}
				if(aPerformance.totalValue) {
					grandTotal += aPerformance.totalValue;
				}
			}

			$scope.totalAbsensi = totalAbsensi;
			$scope.totalBillable = totalBillable;
			$scope.totalTimesheetCollection = totalTimesheetCollection;
			$scope.totalPenilaianUser = totalPenilaianUser;
			$scope.grandTotal = grandTotal;
		};

		var init = function() {
			$scope.performancePromise = $http({method: 'GET', url:'api/performance/retrieve'}).
				success(function(result) {
        		  	$scope.performanceList = result.performanceList;
        		  	$scope.year = result.year;
        		  	calculateTotalPerformance();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.openDetailAbsensi = function() {
			ngDialog.open({
				template: 'detailAbsensiDialog',
				data: JSON.stringify({
			    	performanceList: $scope.performanceList,
			    	totalAbsensi: $scope.totalAbsensi
			    })
			});
		};

		$scope.openDetailBillable = function() {
			ngDialog.open({
				template: 'detailBillableDialog',
				data: JSON.stringify({
			    	performanceList: $scope.performanceList,
			    	totalBillable: $scope.totalBillable
			    })
			});
		};

		$scope.openDetailTimesheetCollection = function() {
			ngDialog.open({
				template: 'detailTimesheetCollectionDialog',
				data: JSON.stringify({
			    	performanceList: $scope.performanceList,
			    	totalTimesheetCollection: $scope.totalTimesheetCollection
			    })
			});
		};

		$scope.openDetailPenilaianUser = function() {
			ngDialog.open({
				template: 'detailPenilaianUserDialog',
				data: JSON.stringify({
			    	performanceList: $scope.performanceList,
			    	totalPenilaianUser: $scope.totalPenilaianUser
			    })
			});
		};

		$scope.openDetailPerformance = function() {
			ngDialog.open({
				template: 'detailPerformanceDialog',
				data: JSON.stringify({
			    	performanceList: $scope.performanceList,
			    	grandTotal: $scope.grandTotal
			    })
			});
		};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
