'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

angular.module('core').run(['$rootScope', '$state', '$location', 'Authentication',
	function($rootScope, $state, $location, Authentication) {
		$rootScope.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams) {
				if(toState.needRole) {
					if(Authentication.user) {
						if(toState.needRole === 'mustBeNotLogged') {
							event.preventDefault();
							$state.transitionTo('home');
						}
						if(toState.needRole !== 'mustBeLogged' && Authentication.user.roles.indexOf(toState.needRole) === -1) {
							event.preventDefault();
							$state.transitionTo('home');
						}
					} else {
						if(toState.needRole !== 'mustBeNotLogged') {
							event.preventDefault();
							$state.transitionTo('signin');
						}
					}
				}
			});
}]);
