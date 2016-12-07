'use strict';

// Configuring the Articles module
angular.module('ero-timesheet-template').run(['Menus',
	function(Menus) {
		//function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Timesheet Template', 'ero/timesheet-template', 'item', 'ero/timesheet-template', false, ['ero']);
	}
]);
