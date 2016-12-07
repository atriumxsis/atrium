'use strict';

// Configuring the Articles module
angular.module('coorporate-events').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
		//Menus.addMenuItem('topbar', 'Coorporate Events', 'ero/coorporate-events', 'dropdown', 'ero/coorporate-events(/create)?',false,['ero']);
		Menus.addMenuItem('topbar', 'Coorporate Events', 'ero/coorporate-events', 'item', 'ero/coorporate-events',false,['ero']);

		//function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles)
		//Menus.addSubMenuItem('topbar', 'ero/coorporate-events', 'List Coorporate Events', 'ero/coorporate-events','ero/coorporate-events(/create)?',false,['ero']);
		//Menus.addSubMenuItem('topbar', 'ero/coorporate-events', 'New Coorporate Event', 'ero/coorporate-events/create','ero/coorporate-events(/create)?',false,['ero']);
	}
]);