'use strict';

angular.module('ero-placement').controller('UpdatePerformanceController', ['$window', '$scope', '$http', 'DateConverterUtils',
	function($window, $scope, $http, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var generatePilihanPenilaianUserList = function() {
			var pilihanPenilaianUserList = [];
			pilihanPenilaianUserList.push({name: '(4) Sangat Memuaskan', value: 4});
			pilihanPenilaianUserList.push({name: '(3) Memuaskan', value: 3});
			pilihanPenilaianUserList.push({name: '(2) Tidak Memuaskan', value: 2});
			pilihanPenilaianUserList.push({name: '(1) Sangat Tidak Memuaskan', value: 1});
			pilihanPenilaianUserList.push({name: '(0) Tidak ada nilai', value: 0});

			$scope.pilihanPenilaianUserList = pilihanPenilaianUserList;
		};

		var init = function() {
			generatePilihanPenilaianUserList();

			$scope.performance = $scope.ngDialogData.aPerformance;
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.simpan = function() {
			console.log('simpan');
			$scope.performance.ski = $scope.selectedSki.value;
			$scope.performance.kompetensiPendukung = $scope.selectedKompetensiPendukung.value;
			$scope.performance.kedisiplinan = $scope.selectedKedisiplinan.value;
			
			var performance = {
				performanceId: $scope.performance._id,
				ski: $scope.selectedSki.value,
				kompetensiPendukung: $scope.selectedKompetensiPendukung.value,
				kedisiplinan: $scope.selectedKedisiplinan.value,
				collectionDate_asString: DateConverterUtils.convertFromDateToString($scope.collectionDate_asDate),
				timesheetCollectionPerform: $scope.timesheetCollectionPerform,
				currentWorkingMonths: $scope.performance.currentWorkingMonths
			};

			console.log(performance.currentWorkingMonths);

			console.log('performance: ' + performance);

			$scope.placementPromise = $http.post('api/performance/update-penilaian-user-and-timesheet-collection', performance).
				success(function(result) {
					// $scope.closeThisDialog();
					$window.location.reload();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		$scope.openCollectionDate = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.collectionDateOpened = !$scope.collectionDateOpened;
	  	};
	  	
		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
