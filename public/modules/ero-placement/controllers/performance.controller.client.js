'use strict';

angular.module('ero-placement').controller('PerformanceController', ['$rootScope', '$scope', '$http', '$stateParams', 'ngDialog',
	function($rootScope, $scope, $http, $stateParams, ngDialog) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var calculateTotalPerformance = function() {
			var totalAbsensi = 0;
			var totalBillable = 0;
			var totalTimesheetCollection = 0;
			var totalPenilaianUser = 0;
			var grandTotal = 0;
			var maxValue = 1;
			var maxBillabe = 0.6;

			for(var i = 0; i < $scope.performanceList.length; i++) {
				var aPerformance = $scope.performanceList[i];
				console.log(">>> "+aPerformance.totalValue);

				if(aPerformance.kriteriaPenilaianUser && aPerformance.kriteriaPenilaianUser.kriteriaValue) {
					totalPenilaianUser += aPerformance.kriteriaPenilaianUser.kriteriaValue;
				}
				if(aPerformance.kriteriaTimesheetCollection && aPerformance.kriteriaTimesheetCollection.kriteriaValue) {
					totalTimesheetCollection += aPerformance.kriteriaTimesheetCollection.kriteriaValue;
				}
				if(aPerformance.kriteriaPersistensi && aPerformance.kriteriaPersistensi.kriteriaValue) {
					totalAbsensi += aPerformance.kriteriaPersistensi.kriteriaValue;
				}
				//if(aPerformance.kriteriaAbsensi && aPerformance.kriteriaAbsensi.kriteriaValue) {
				//	totalAbsensi += aPerformance.kriteriaAbsensi.kriteriaValue;
				//}
				if(aPerformance.kriteriaBillableUtilization && aPerformance.kriteriaBillableUtilization.kriteriaValue) {
					totalBillable += aPerformance.kriteriaBillableUtilization.kriteriaValue;
				}
				if(aPerformance.totalValue) {
					totalBillable = maxBillabe;
					grandTotal += aPerformance.totalValue;
				}
			}

			$scope.totalAbsensi = totalAbsensi;
			// $scope.totalBillable = totalBillable;

			if(totalBillable > maxValue){
				$scope.totalBillable = maxValue;
			} else {
				$scope.totalBillable = totalBillable;
			}
			$scope.totalTimesheetCollection = totalTimesheetCollection;
			$scope.totalPenilaianUser = totalPenilaianUser;
			// $scope.grandTotal = grandTotal;
			
			if(grandTotal > maxValue){
				$scope.grandTotal = maxValue;
			} else {
				$scope.grandTotal = grandTotal;
			}

			//var maxAbsensi = 0.15;
			//var maxTimesheetCollecting = 0.15;
			//var maxPenilaianUser = 0.10;

			//if(totalBillable > maxBillabe && totalAbsensi == 0 && totalTimesheetCollection == 0 && totalPenilaianUser == 0){
				//$scope.grandTotal = maxBillabe;
			//}
			//if(totalAbsensi >= maxAbsensi
			//	&& totalBillable == 0 && totalTimesheetCollection == 0 && totalPenilaianUser == 0){
			//	$scope.grandTotal = maxAbsensi;
			//}
			//if(totalTimesheetCollection >= maxTimesheetCollecting
			//	&& totalBillable == 0 && totalAbsensi == 0 && totalPenilaianUser == 0){
			//	$scope.grandTotal = maxTimesheetCollecting;
			//}
			//if(totalPenilaianUser >= maxPenilaianUser
			//	&& totalBillable == 0 && totalAbsensi == 0 && totalTimesheetCollection == 0){
			//	$scope.grandTotal = maxPenilaianUser;
			//}


            //
			//if(totalBillable >= maxBillabe && totalAbsensi == null && totalTimesheetCollection == null && totalPenilaianUser == null){
			//	$scope.grandTotal = maxBillabe;
			//} else
			//if(totalBillable == null && totalAbsensi >= maxAbsensi && totalTimesheetCollection == null && totalPenilaianUser == null){
			//	$scope.grandTotal = maxAbsensi;
			//}
			//if(totalBillable == null && totalAbsensi == null && totalTimesheetCollection >= maxTimesheetCollecting && totalPenilaianUser == null){
			//	$scope.grandTotal = maxTimesheetCollecting;
			//}
			//if(totalBillable == null && totalAbsensi == null && totalTimesheetCollection == null && totalPenilaianUser >= maxPenilaianUser){
			//	$scope.grandTotal = maxPenilaianUser;
			//}
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

		var retrievePerformanceData = function() {
			$scope.performancePromise = $http({method: 'GET', url:'api/performance/' + $stateParams.resourceId + '/retrieve', params: {year: $scope.currentYear}}).
				success(function(result) {
        		  	$scope.performanceList = result.performanceList;
					//console.log($scope.performanceList);
        		  	$scope.year = result.year;
        		  	calculateTotalPerformance();
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
			retrieveResourceData();
			retrievePerformanceData();
		};

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
				controller: ['$scope', function($scope) {
					$scope.updatePerformanceForPenilaianUser = function(aPerformance) {
						ngDialog.open({
						    template: '/modules/ero-placement/views/update-performance-for-penilaian-user-and-timesheet-collection.view.client.html',
						    controller: 'UpdatePerformanceController',
						    data: JSON.stringify({
						    	aPerformance: aPerformance
						    })
						});
					};
				}],
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
