'use strict';

// Configuring the Articles module
angular.module('resource-project').run(['Menus',
	function(Menus) {
		//function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Project', 'resource/project', 'item', 'resource/project', false, ['resource']);
	}
]);
