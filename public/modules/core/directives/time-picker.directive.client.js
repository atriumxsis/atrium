'use strict';

angular.module('core').directive('timePicker', function () {
	var controller = ['$scope', function ($scope) {
			var itemGenerator = function(from, to) {
				var itemList = [];

				for(var i = from; i <= to; i++) {
					var item = i.toString();
					if(item.length < 2) {
						item = ('0' + i);
					}

					itemList.push(item);
				}

				return itemList;
			};

			var deconstructTime = function() {
				if($scope.time) {
					$scope.selectedJam = $scope.time.split(':')[0];
					$scope.selectedMenit = $scope.time.split(':')[1];
				}
			};

			var constructTime = function() {
				if($scope.selectedJam && $scope.selectedMenit) {
					$scope.time = ($scope.selectedJam + ':' + $scope.selectedMenit);
				} else {
					$scope.time = null;
				}
			};

	 		var init = function() {
	 			$scope.daftarJam = itemGenerator(0, 23);
	 			$scope.daftarMenit = itemGenerator(0, 59);
	 			$scope.selectedJam = null;
	 			$scope.selectedMenit = null;
	 			deconstructTime();
	 		};

	 		init();

	 		$scope.$watch('selectedJam', function () {
	 			constructTime();
	 		});

	 		$scope.$watch('selectedMenit', function () {
	 			constructTime();
	 		});
	}];
        
	var template = '<select ' +
                   '		ng-model="selectedJam" ' +
                   '        placeholder="Jam" ' +
                   '		ng-options="jam as jam for jam in daftarJam"> ' +
                   '</select>' +
                   '<b> : </b>' +
                   '<select ' +
                   '		ng-model="selectedMenit" ' +
                   '        placeholder="Menit" ' +
                   '		ng-options="menit as menit for menit in daftarMenit"> ' +
                   '</select>';

    return {
    	restrict: 'E',
    	scope: {
    		time: '='
    	},
        template: template,
        controller: controller
    };
});
