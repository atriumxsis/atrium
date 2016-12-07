'use strict';

angular.module('ero-home').controller('DetailPlacementOnClientController', ['$scope',
	function($scope) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var init = function() {
			$scope.placementData = $scope.ngDialogData.placementData;
			$scope.externalPlacement = $scope.ngDialogData.placementData.client.external;
		};

		init();

		// =====================================================================
		// $scope Member
		// =====================================================================		

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
