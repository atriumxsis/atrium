'use strict';

angular.module('ero-placement').controller('CreatePerformanceController', ['$scope', '$http', 'DateConverterUtils',
	function($scope, $http, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var generateMonthDataList = function() {
			$scope.monthDataList = [];
			var monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ];

			var today = new Date();
			var month = today.getMonth();
			var year = today.getFullYear();

			var resYear,resMonth,resDay = null;
			var limit = null;
			var resourceJoinDate = null;
			var sisaMonth =null;
			var joinDate = $scope.ngDialogData.aResource.joinDate_asString;
			if (joinDate !== undefined && joinDate !== null) {
				resYear = joinDate.split('-')[0];			// Start from 1.
				resMonth = (joinDate.split('-')[1] - 1); 	// Start from 0. January is 0
				resDay = joinDate.split('-')[2]; 			// Start from 1.

				resourceJoinDate = new Date(resYear, resMonth, resDay);
			}

			if(resourceJoinDate.getFullYear() === year){
				if ((month - resourceJoinDate.getMonth())>= 2 ){
					limit = 2;
				}else{
					limit = month - resourceJoinDate.getMonth();
					//console.log("month adalah = "+month);
					//console.log("resMonth adalah = "+resourceJoinDate.getMonth());
					//console.log("limit adalah = "+limit);
				}
				sisaMonth = month-resourceJoinDate.getMonth();
			}else{
				limit = 2;
				sisaMonth = month;
			}


			$scope.monthDataList.push({
				name: year + ', ' + monthNames[month],
				year: year,
				month: month
			});


			for(var i = 0; i < sisaMonth; i++) {
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
			generateMonthDataList();
			generatePilihanPenilaianUserList();

			$scope.aResource = $scope.ngDialogData.aResource;
			$scope.performance = {
				resource: $scope.aResource._id,
				year: null,
				month: null,
				ski: null,
				collectionDate_asString: DateConverterUtils.convertFromDateToString(new Date()),
				kompetensiPendukung: null,
				kedisiplinan: null,
				collectionDate: null,
				timesheetCollectionPerform: false
			};

			$scope.collectionDate_asDate = DateConverterUtils.convertFromStringToDate($scope.performance.collectionDate_asString);
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.simpan = function() {
			$scope.performance.year = $scope.selectedMonthData.year;
			$scope.performance.month = $scope.selectedMonthData.month;
			$scope.performance.ski = $scope.selectedSki.value;
			$scope.performance.kompetensiPendukung = $scope.selectedKompetensiPendukung.value;
			$scope.performance.kedisiplinan = $scope.selectedKedisiplinan.value;
			$scope.performance.collectionDate_asString = DateConverterUtils.convertFromDateToString($scope.collectionDate_asDate);

			$scope.placementPromise = $http.post('api/performance/create-penilaian-user-and-timesheet-collection', $scope.performance).
				success(function(result) {
					$scope.closeThisDialog();
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
