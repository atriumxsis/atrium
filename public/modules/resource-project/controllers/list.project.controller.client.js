'use strict';

angular.module('resource-project').controller('ResourceProjectListController', ['$rootScope', '$scope', '$http', 'ngDialog',
	function($rootScope, $scope, $http, ngDialog) {
		// =====================================================================
		// Non $scope member
		// =====================================================================
		var retrieveProjectList = function() {
		    $scope.projectListPromise = $http({method: 'GET', url:'api/project/retrieve'}).
				success(function(projectList) {
		  			$scope.projectList = projectList;
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);
		};

		// =====================================================================
		// $scope Member
		// =====================================================================
		$scope.prepare = function () {
			retrieveProjectList();
		};

		$scope.openTambahProjectDialog = function() {
			ngDialog.open({
			    template: '/modules/resource-project/views/form.project.view.client.html',
			    controller: 'FormProjectController',
			    data: JSON.stringify({
			    	dialogTitle: 'Tambah Project'
			    })
			});
		};

		$scope.openEditProjectDialog = function(project) {
			ngDialog.open({
			    template: '/modules/resource-project/views/form.project.view.client.html',
			    controller: 'FormProjectController',
			    data: JSON.stringify({
			    	dialogTitle: 'Edit Project',
			    	project: project
			    })
			});
		};

		$scope.deleteProject = function(project) {
			$http({method: 'POST', url:'api/project/' + project._id + '/delete'}).
				success(function() {
		  			retrieveProjectList();
	    		}).
	    		error(function(err) {
	      			$scope.error = err.data.message;
	  			}
	  		);	
		};

		// =====================================================================
		// Event listener
		// =====================================================================
		$rootScope.$on('ngDialog.closed', function (e, $dialog) {
			retrieveProjectList();
		});
	}
]);
