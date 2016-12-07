'use strict';

angular.module('resource-project').controller('FormProjectController', ['$scope', '$http', 
	function($scope, $http) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var createNewProject = function() {
			$scope.formPromise = $http.post('api/project/create', $scope.project).
				success(function(result) {
					$scope.closeThisDialog();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		var updateProject = function() {
			$scope.formPromise = $http.post('api/project/update', $scope.project).
				success(function(project) {
					$scope.closeThisDialog();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		// =====================================================================
		// $scope Member
		// =====================================================================		
		$scope.init = function() {
			$scope.dialogTitle = $scope.ngDialogData.dialogTitle;

			if($scope.ngDialogData.project !== undefined && $scope.ngDialogData.project !== null) {
				$scope.editMode = true;
				$scope.project = $scope.ngDialogData.project;
			} else {
				$scope.project = {
					_id: null,
					clientName: null,
					location: null,
					departmentName: null,
					userName: null,
					projectName: null,
					startProject: null,
					endProject: null,
					role: null,
					projectPhase: null,
					projectDescription: null,
					projectTechnology: null,
					mainTask: null
				};
			}
		};

		$scope.init();

		$scope.simpan = function() {
			if($scope.editMode) {
				updateProject();
			} else {
				createNewProject();
			}
		};

		// =====================================================================
		// Event listener
		// =====================================================================

	}
]);
