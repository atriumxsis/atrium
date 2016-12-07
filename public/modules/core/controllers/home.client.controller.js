'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		// =====================================================================
		// Non $scope member
		// =====================================================================		
		var init = function() {
			$scope.authentication = Authentication;
		};

		init();
		
		var redirectToHome = function(user) {
			var location = '/';

			if(user.roles.indexOf('admin') !== -1) {
				location = '/admin/home';
			} else if(user.roles.indexOf('ero') !== -1) {
				location = '/ero/home';
			} else if(user.roles.indexOf('resource') !== -1) {
				location = '/resource/home';
			}

			$location.path(location);
		};

		if ($scope.authentication.user) {
			redirectToHome($scope.authentication.user);
		}

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function() {
			$scope.credentials = {
				email: null,
				password: null
			};
		};

		$scope.signin = function() {
			$scope.authenticationPromise = $http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				$scope.authentication.user = response;
				redirectToHome($scope.authentication.user);
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
