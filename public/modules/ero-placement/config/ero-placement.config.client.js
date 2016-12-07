'use strict';

// Configuring the Articles module
angular.module('ero-placement').run(['Menus',
	function(Menus) {
		//function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Placement', 'ero/placement', 'item', 'ero/placement', false, ['ero']);
	}
]);
