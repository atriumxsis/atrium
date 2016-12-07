'use strict';

// Configuring the Articles module
angular.module('ero-client').run(['Menus',
	function(Menus) {
		//function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Client', 'ero/client', 'item', 'ero/client', false, ['ero']);
	}
]);
