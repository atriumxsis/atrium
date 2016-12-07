'use strict';

// Configuring the Articles module
angular.module('ero-resource').run(['Menus',
	function(Menus) {
		//function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Resource', 'ero/resource', 'item', 'ero/resource', false, ['ero']);
	}
]);
