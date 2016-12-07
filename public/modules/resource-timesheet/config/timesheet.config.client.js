'use strict';

// Configuring the Articles module
angular.module('timesheet').run(['Menus',
	function(Menus) {
		//function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Timesheet', 'resource/timesheet', 'item', 'resource/timesheet', false, ['resource']);
	}
]);
