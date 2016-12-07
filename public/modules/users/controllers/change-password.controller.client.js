'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Change user password
		$scope.changeUserPassword = function(isValid) {
			$scope.success = false;
			if($scope.passwordDetails.newPassword !== $scope.passwordDetails.verifyPassword) {
				isValid = false;
				$scope.notMatchPassword = true;
			} else {
				$scope.notMatchPassword = false;
			}

			if(isValid) {
				$scope.success = $scope.error = null;

				$scope.settingsPromise = $http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
					// If successful show success message and clear form
					$scope.success = true;
					$scope.passwordDetails = null;
					$scope.changePasswordForm.$setPristine();
				}).error(function(response) {
					$scope.error = response.message;
				});
			}
		};
	}
]);
