'use strict';

angular.module('ero-home').controller('EroHomeController', ['$scope', '$http', 'ngDialog', 'DateConverterUtils',
	function($scope, $http, ngDialog, DateConverterUtils) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var externalPlacementList = [];
		var internalPlacementList = [];
		var unknownPlacementList = [];

		var calculateExternalPlacementPeriod = function() {
			for(var i = 0; i < externalPlacementList.length; i++) {
				var countOfOverDuePRF = 0;
				var countOfOneWeekPRF = 0;
				var countOfTwoWeekPRF = 0;
				var countOfFourWeekPRF = 0;
				var countOfMoreThanFourWeekPRF = 0;

				var oneDayInMilis = (1000 * 60 * 60 * 24);

				var today_asDate = DateConverterUtils.todayAsDate();
				var nextOneWeek_asDate = new Date(today_asDate.getTime() + (oneDayInMilis * 7));
				var nextTwoWeek_asDate = new Date(today_asDate.getTime() + (oneDayInMilis * 14));
				var nextFourWeek_asDate = new Date(today_asDate.getTime() + (oneDayInMilis * 28));

				for(var j = 0; j < externalPlacementList[i].resourceList.length; j++) {
					var placement_toDate_asDate = DateConverterUtils.convertFromStringToDate(externalPlacementList[i].resourceList[j].lastPlacement.toDate_asString);

					if(placement_toDate_asDate.getTime() < today_asDate.getTime()) {
						countOfOverDuePRF++;
						externalPlacementList[i].resourceList[j].markAsOverDue = true;
					} else if(today_asDate.getTime() <= placement_toDate_asDate.getTime() && placement_toDate_asDate.getTime() < nextOneWeek_asDate.getTime()) {
						countOfOneWeekPRF++;
						externalPlacementList[i].resourceList[j].markAsOneWeek = true;
					} else if(nextOneWeek_asDate.getTime() <= placement_toDate_asDate.getTime() && placement_toDate_asDate.getTime() < nextTwoWeek_asDate.getTime()) {
						countOfTwoWeekPRF++;
						externalPlacementList[i].resourceList[j].markAsTwoWeek = true;
					} else if(nextTwoWeek_asDate.getTime() <= placement_toDate_asDate.getTime() && placement_toDate_asDate.getTime() < nextFourWeek_asDate.getTime()) {
						countOfFourWeekPRF++;
						externalPlacementList[i].resourceList[j].markAsFourWeek = true;
					} else if(nextFourWeek_asDate.getTime() <= placement_toDate_asDate.getTime()) {
						countOfMoreThanFourWeekPRF++;
						externalPlacementList[i].resourceList[j].markAsMoreThantFourWeek = true;
					}
				}

				externalPlacementList[i].countOfOverDuePRF = countOfOverDuePRF;
				externalPlacementList[i].countOfOneWeekPRF = countOfOneWeekPRF;
				externalPlacementList[i].countOfTwoWeekPRF = countOfTwoWeekPRF;
				externalPlacementList[i].countOfFourWeekPRF = countOfFourWeekPRF;
				externalPlacementList[i].countOfMoreThanFourWeekPRF = countOfMoreThanFourWeekPRF;
			}
		};

		var findOrCreateElementOfPlacementList = function(resource, placementList) {
			for(var i = 0; i < placementList.length; i++) {
				if(placementList[i].client._id === resource.lastPlacement.client._id) {
					return placementList[i];
				}
			}

			// not found
			var newElementOfArray = {
				client: resource.lastPlacement.client,
				resourceList: [],
				countOfOverDuePRF: 0,
				countOfOneWeekPRF: 0,
				countOfTwoWeekPRF: 0,
				countOfFourWeekPRF: 0,
				countOfMoreThanFourWeekPRF: 0
			};
			placementList.push(newElementOfArray);

			return newElementOfArray;
		};

		var calculatePlacementData = function(resourceList) {
			var countOfExternalPlacement = 0;
			var countOfInternalPlacement = 0;
			var countOfUnknownPlacement = 0;

			for(var i = 0; i < resourceList.length; i++) {
				if(resourceList[i].lastPlacement && resourceList[i].lastPlacement.client) {
					if(resourceList[i].lastPlacement.client.external) {
						findOrCreateElementOfPlacementList(resourceList[i], externalPlacementList).resourceList.push(resourceList[i]);
						countOfExternalPlacement++;
					} else {
						findOrCreateElementOfPlacementList(resourceList[i], internalPlacementList).resourceList.push(resourceList[i]);
						countOfInternalPlacement++;
					}
				} else {
					unknownPlacementList.push(resourceList[i]);
					countOfUnknownPlacement++;
				}
			}

			calculateExternalPlacementPeriod();

			$scope.externalPlacementList = externalPlacementList;
			$scope.internalPlacementList = internalPlacementList;
			$scope.unknownPlacementList = unknownPlacementList;
			$scope.countOfExternalPlacement = countOfExternalPlacement;
			$scope.countOfInternalPlacement = countOfInternalPlacement;
			$scope.countOfUnknownPlacement = countOfUnknownPlacement;
			$scope.totalCountOfActiveResource = (countOfExternalPlacement + countOfInternalPlacement + countOfUnknownPlacement);
		};

		var retrieveActiveResource = function() {
			$scope.activeResourcePromise = $http({method: 'GET', url:'api/resource/active'}).
				success(function(resourceList) {
					calculatePlacementData(resourceList);
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var init = function() {
			retrieveActiveResource();
			$scope.today = DateConverterUtils.todayAsString();
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================		
		$scope.openDetailPlacementOnClientDialog = function(placementData) {
			ngDialog.open({
			    template: '/modules/ero-home/views/detail-placement-on-client.view.client.html',
			    controller: 'DetailPlacementOnClientController',
			    data: JSON.stringify({
			    	placementData: placementData
			    })
			});
		};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
