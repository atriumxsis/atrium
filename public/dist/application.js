'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'ts-online-resource';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngDialog',
        'cgBusy'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
angular.module(ApplicationConfiguration.applicationModuleName).value('cgBusyDefaults', {
  message: 'Mohon tunggu sebentar...',
  backdrop: true,
  minDuration: 100,
  templateUrl: 'lib/angular-busy/angular-busy.html'
});'use strict';
ApplicationConfiguration.registerModule('admin-home');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
angular.module('core').run([
  '$rootScope',
  '$state',
  '$location',
  'Authentication',
  function ($rootScope, $state, $location, Authentication) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.needRole) {
        if (Authentication.user) {
          if (toState.needRole === 'mustBeNotLogged') {
            event.preventDefault();
            $state.transitionTo('home');
          }
          if (toState.needRole !== 'mustBeLogged' && Authentication.user.roles.indexOf(toState.needRole) === -1) {
            event.preventDefault();
            $state.transitionTo('home');
          }
        } else {
          if (toState.needRole !== 'mustBeNotLogged') {
            event.preventDefault();
            $state.transitionTo('signin');
          }
        }
      }
    });
  }
]);'use strict';
ApplicationConfiguration.registerModule('ero-client');'use strict';
ApplicationConfiguration.registerModule('ero-home');'use strict';
ApplicationConfiguration.registerModule('ero-placement');'use strict';
ApplicationConfiguration.registerModule('ero-resource');'use strict';
ApplicationConfiguration.registerModule('ero-timesheet-template');'use strict';
ApplicationConfiguration.registerModule('ero-timesheet');'use strict';
ApplicationConfiguration.registerModule('resource-home');'use strict';
ApplicationConfiguration.registerModule('resource-project');'use strict';
ApplicationConfiguration.registerModule('timesheet');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('admin-home').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('admin-home', {
      url: '/admin/home',
      templateUrl: 'modules/admin-home/views/home.view.client.html',
      needRole: 'admin'
    });
  }
]);'use strict';
angular.module('admin-home').controller('AdminHomeController', [
  '$scope',
  '$http',
  function ($scope, $http) {
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    // =====================================================================
    // Non $scope member
    // =====================================================================		
    var init = function () {
      $scope.authentication = Authentication;
    };
    init();
    var redirectToHome = function (user) {
      var location = '/';
      if (user.roles.indexOf('admin') !== -1) {
        location = '/admin/home';
      } else if (user.roles.indexOf('ero') !== -1) {
        location = '/ero/home';
      } else if (user.roles.indexOf('resource') !== -1) {
        location = '/resource/home';
      }
      $location.path(location);
    };
    if ($scope.authentication.user) {
      redirectToHome($scope.authentication.user);
    }
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      $scope.credentials = {
        email: null,
        password: null
      };
    };
    $scope.signin = function () {
      $scope.authenticationPromise = $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        $scope.authentication.user = response;
        redirectToHome($scope.authentication.user);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('core').directive('timePicker', function () {
  var controller = [
      '$scope',
      function ($scope) {
        var itemGenerator = function (from, to) {
          var itemList = [];
          for (var i = from; i <= to; i++) {
            var item = i.toString();
            if (item.length < 2) {
              item = '0' + i;
            }
            itemList.push(item);
          }
          return itemList;
        };
        var deconstructTime = function () {
          if ($scope.time) {
            $scope.selectedJam = $scope.time.split(':')[0];
            $scope.selectedMenit = $scope.time.split(':')[1];
          }
        };
        var constructTime = function () {
          if ($scope.selectedJam && $scope.selectedMenit) {
            $scope.time = $scope.selectedJam + ':' + $scope.selectedMenit;
          } else {
            $scope.time = null;
          }
        };
        var init = function () {
          $scope.daftarJam = itemGenerator(0, 23);
          $scope.daftarMenit = itemGenerator(0, 59);
          $scope.selectedJam = null;
          $scope.selectedMenit = null;
          deconstructTime();
        };
        init();
        $scope.$watch('selectedJam', function () {
          constructTime();
        });
        $scope.$watch('selectedMenit', function () {
          constructTime();
        });
      }
    ];
  var template = '<select ' + '\t\tng-model="selectedJam" ' + '        placeholder="Jam" ' + '\t\tng-options="jam as jam for jam in daftarJam"> ' + '</select>' + '<b> : </b>' + '<select ' + '\t\tng-model="selectedMenit" ' + '        placeholder="Menit" ' + '\t\tng-options="menit as menit for menit in daftarMenit"> ' + '</select>';
  return {
    restrict: 'E',
    scope: { time: '=' },
    template: template,
    controller: controller
  };
});'use strict';
// The main purpose of this service is to remove ambiguity timezone in client and in server
angular.module('core').service('DateConverterUtils', [function () {
    this.convertFromDateToString = function (date) {
      var returnValue = null;
      if (date !== undefined && date !== null) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        returnValue = year + '-' + month + '-' + day;
      }
      return returnValue;
    };
    this.convertFromStringToDate = function (dateAsString) {
      var returnValue = null;
      if (dateAsString !== undefined && dateAsString !== null) {
        var year = dateAsString.split('-')[0];
        // Start from 1.
        var month = dateAsString.split('-')[1] - 1;
        // Start from 0. January is 0
        var day = dateAsString.split('-')[2];
        // Start from 1.
        returnValue = new Date(year, month, day);
      }
      return returnValue;
    };
    this.todayAsString = function () {
      return this.convertFromDateToString(new Date());
    };
    this.todayAsDate = function () {
      return this.convertFromStringToDate(this.todayAsString());
    };
  }]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar', false, [
      'resource',
      'ero'
    ]);
  }]);'use strict';
// Configuring the Articles module
angular.module('ero-client').run([
  'Menus',
  function (Menus) {
    //function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Client', 'ero/client', 'item', 'ero/client', false, ['ero']);
  }
]);'use strict';
// Setting up route
angular.module('ero-client').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('ero-client-list', {
      url: '/ero/client',
      templateUrl: 'modules/ero-client/views/list-client.view.client.html',
      needRole: 'ero'
    });
  }
]);'use strict';
angular.module('ero-client').controller('FormClientController', [
  '$scope',
  '$http',
  function ($scope, $http) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var createNewClient = function () {
      $scope.formPromise = $http.post('api/client', $scope.client).success(function (result) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var updateClient = function () {
      $scope.formPromise = $http.post('api/client/update', $scope.client).success(function (client) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================		
    $scope.init = function () {
      $scope.dialogTitle = $scope.ngDialogData.dialogTitle;
      if ($scope.ngDialogData.client !== undefined && $scope.ngDialogData.client !== null) {
        $scope.editMode = true;
        $scope.client = $scope.ngDialogData.client;
      } else {
        $scope.client = {
          _id: null,
          name: null,
          external: true
        };
      }
    };
    $scope.init();
    $scope.simpan = function () {
      if ($scope.editMode) {
        updateClient();
      } else {
        createNewClient();
      }
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-client').controller('EroClientListController', [
  '$rootScope',
  '$scope',
  '$http',
  'ngDialog',
  function ($rootScope, $scope, $http, ngDialog) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var retrieveClientList = function () {
      $scope.clientListPromise = $http({
        method: 'GET',
        url: 'api/client'
      }).success(function (clientList) {
        $scope.clientList = clientList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveClientList();
    };
    $scope.openTambahClientDialog = function () {
      ngDialog.open({
        template: '/modules/ero-client/views/form-client.view.client.html',
        controller: 'FormClientController',
        data: JSON.stringify({ dialogTitle: 'Tambah Client' })
      });
    };
    $scope.openEditClientDialog = function (client) {
      ngDialog.open({
        template: '/modules/ero-client/views/form-client.view.client.html',
        controller: 'FormClientController',
        data: JSON.stringify({
          dialogTitle: 'Edit Client',
          client: client
        })
      });
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      retrieveClientList();
    });
  }
]);'use strict';
// Setting up route
angular.module('ero-home').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('ero-home', {
      url: '/ero/home',
      templateUrl: 'modules/ero-home/views/home.view.client.html',
      needRole: 'ero'
    });
  }
]);'use strict';
angular.module('ero-home').controller('DetailPlacementOnClientController', [
  '$scope',
  function ($scope) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var init = function () {
      $scope.placementData = $scope.ngDialogData.placementData;
      $scope.externalPlacement = $scope.ngDialogData.placementData.client.external;
    };
    init();  // =====================================================================
             // $scope Member
             // =====================================================================		
             // =====================================================================
             // Event listener
             // =====================================================================
  }
]);'use strict';
angular.module('ero-home').controller('EroHomeController', [
  '$scope',
  '$http',
  'ngDialog',
  'DateConverterUtils',
  function ($scope, $http, ngDialog, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var externalPlacementList = [];
    var internalPlacementList = [];
    var unknownPlacementList = [];
    var calculateExternalPlacementPeriod = function () {
      for (var i = 0; i < externalPlacementList.length; i++) {
        var countOfOverDuePRF = 0;
        var countOfOneWeekPRF = 0;
        var countOfTwoWeekPRF = 0;
        var countOfFourWeekPRF = 0;
        var countOfMoreThanFourWeekPRF = 0;
        var oneDayInMilis = 1000 * 60 * 60 * 24;
        var today_asDate = DateConverterUtils.todayAsDate();
        var nextOneWeek_asDate = new Date(today_asDate.getTime() + oneDayInMilis * 7);
        var nextTwoWeek_asDate = new Date(today_asDate.getTime() + oneDayInMilis * 14);
        var nextFourWeek_asDate = new Date(today_asDate.getTime() + oneDayInMilis * 28);
        for (var j = 0; j < externalPlacementList[i].resourceList.length; j++) {
          var placement_toDate_asDate = DateConverterUtils.convertFromStringToDate(externalPlacementList[i].resourceList[j].lastPlacement.toDate_asString);
          if (placement_toDate_asDate.getTime() < today_asDate.getTime()) {
            countOfOverDuePRF++;
            externalPlacementList[i].resourceList[j].markAsOverDue = true;
          } else if (today_asDate.getTime() <= placement_toDate_asDate.getTime() && placement_toDate_asDate.getTime() < nextOneWeek_asDate.getTime()) {
            countOfOneWeekPRF++;
            externalPlacementList[i].resourceList[j].markAsOneWeek = true;
          } else if (nextOneWeek_asDate.getTime() <= placement_toDate_asDate.getTime() && placement_toDate_asDate.getTime() < nextTwoWeek_asDate.getTime()) {
            countOfTwoWeekPRF++;
            externalPlacementList[i].resourceList[j].markAsTwoWeek = true;
          } else if (nextTwoWeek_asDate.getTime() <= placement_toDate_asDate.getTime() && placement_toDate_asDate.getTime() < nextFourWeek_asDate.getTime()) {
            countOfFourWeekPRF++;
            externalPlacementList[i].resourceList[j].markAsFourWeek = true;
          } else if (nextFourWeek_asDate.getTime() <= placement_toDate_asDate.getTime()) {
            countOfMoreThanFourWeekPRF++;
            externalPlacementList[i].resourceList[j].markAsMoreThantFourWeek = true;
          }
        }
        externalPlacementList[i].countOfOverDuePRF = countOfOverDuePRF;
        externalPlacementList[i].countOfOneWeekPRF = countOfOneWeekPRF;
        externalPlacementList[i].countOfTwoWeekPRF = countOfTwoWeekPRF;
        externalPlacementList[i].countOfFourWeekPRF = countOfFourWeekPRF;
        externalPlacementList[i].countOfMoreThanFourWeekPRF = countOfMoreThanFourWeekPRF;
      }
    };
    var findOrCreateElementOfPlacementList = function (resource, placementList) {
      for (var i = 0; i < placementList.length; i++) {
        if (placementList[i].client._id === resource.lastPlacement.client._id) {
          return placementList[i];
        }
      }
      // not found
      var newElementOfArray = {
          client: resource.lastPlacement.client,
          resourceList: [],
          countOfOverDuePRF: 0,
          countOfOneWeekPRF: 0,
          countOfTwoWeekPRF: 0,
          countOfFourWeekPRF: 0,
          countOfMoreThanFourWeekPRF: 0
        };
      placementList.push(newElementOfArray);
      return newElementOfArray;
    };
    var calculatePlacementData = function (resourceList) {
      var countOfExternalPlacement = 0;
      var countOfInternalPlacement = 0;
      var countOfUnknownPlacement = 0;
      for (var i = 0; i < resourceList.length; i++) {
        if (resourceList[i].lastPlacement && resourceList[i].lastPlacement.client) {
          if (resourceList[i].lastPlacement.client.external) {
            findOrCreateElementOfPlacementList(resourceList[i], externalPlacementList).resourceList.push(resourceList[i]);
            countOfExternalPlacement++;
          } else {
            findOrCreateElementOfPlacementList(resourceList[i], internalPlacementList).resourceList.push(resourceList[i]);
            countOfInternalPlacement++;
          }
        } else {
          unknownPlacementList.push(resourceList[i]);
          countOfUnknownPlacement++;
        }
      }
      calculateExternalPlacementPeriod();
      $scope.externalPlacementList = externalPlacementList;
      $scope.internalPlacementList = internalPlacementList;
      $scope.unknownPlacementList = unknownPlacementList;
      $scope.countOfExternalPlacement = countOfExternalPlacement;
      $scope.countOfInternalPlacement = countOfInternalPlacement;
      $scope.countOfUnknownPlacement = countOfUnknownPlacement;
      $scope.totalCountOfActiveResource = countOfExternalPlacement + countOfInternalPlacement + countOfUnknownPlacement;
    };
    var retrieveActiveResource = function () {
      $scope.activeResourcePromise = $http({
        method: 'GET',
        url: 'api/resource/active'
      }).success(function (resourceList) {
        calculatePlacementData(resourceList);
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var init = function () {
      retrieveActiveResource();
      $scope.today = DateConverterUtils.todayAsString();
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================		
    $scope.openDetailPlacementOnClientDialog = function (placementData) {
      ngDialog.open({
        template: '/modules/ero-home/views/detail-placement-on-client.view.client.html',
        controller: 'DetailPlacementOnClientController',
        data: JSON.stringify({ placementData: placementData })
      });
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
// Configuring the Articles module
angular.module('ero-placement').run([
  'Menus',
  function (Menus) {
    //function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Placement', 'ero/placement', 'item', 'ero/placement', false, ['ero']);
  }
]);'use strict';
// Setting up route
angular.module('ero-placement').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('ero-placement--list-placement', {
      url: '/ero/placement',
      templateUrl: 'modules/ero-placement/views/list-placement.view.client.html',
      needRole: 'ero'
    }).state('ero-placement--detail-placements', {
      url: '/ero/placement/resource/:resourceId',
      templateUrl: 'modules/ero-placement/views/detail-placements.view.client.html',
      needRole: 'ero'
    }).state('ero-placement--performance', {
      url: '/ero/performance/:resourceId',
      templateUrl: 'modules/ero-placement/views/performance.view.client.html',
      needRole: 'ero'
    }).state('ero-placement--project-list', {
      url: '/ero/project-list/:resourceId',
      templateUrl: 'modules/ero-placement/views/list-project.view.client.html',
      needRole: 'ero'
    });
  }
]);'use strict';
angular.module('ero-placement').controller('CreatePerformanceController', [
  '$scope',
  '$http',
  'DateConverterUtils',
  function ($scope, $http, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var generateMonthDataList = function () {
      $scope.monthDataList = [];
      var monthNames = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember'
        ];
      var today = new Date();
      var month = today.getMonth();
      var year = today.getFullYear();
      $scope.monthDataList.push({
        name: year + ', ' + monthNames[month],
        year: year,
        month: month
      });
      for (var i = 0; i < 2; i++) {
        month = month - 1;
        if (month < 0) {
          month = 11;
          year = year - 1;
        }
        $scope.monthDataList.push({
          name: year + ', ' + monthNames[month],
          year: year,
          month: month
        });
      }
    };
    var generatePilihanPenilaianUserList = function () {
      var pilihanPenilaianUserList = [];
      pilihanPenilaianUserList.push({
        name: '(4) Sangat Memuaskan',
        value: 4
      });
      pilihanPenilaianUserList.push({
        name: '(3) Memuaskan',
        value: 3
      });
      pilihanPenilaianUserList.push({
        name: '(2) Tidak Memuaskan',
        value: 2
      });
      pilihanPenilaianUserList.push({
        name: '(1) Sangat Tidak Memuaskan',
        value: 1
      });
      pilihanPenilaianUserList.push({
        name: '(0) Tidak ada nilai',
        value: 0
      });
      $scope.pilihanPenilaianUserList = pilihanPenilaianUserList;
    };
    var init = function () {
      generateMonthDataList();
      generatePilihanPenilaianUserList();
      $scope.aResource = $scope.ngDialogData.aResource;
      $scope.performance = {
        resource: $scope.aResource._id,
        year: null,
        month: null,
        ski: null,
        collectionDate_asString: DateConverterUtils.convertFromDateToString(new Date()),
        kompetensiPendukung: null,
        kedisiplinan: null,
        collectionDate: null,
        timesheetCollectionPerform: false
      };
      $scope.collectionDate_asDate = DateConverterUtils.convertFromStringToDate($scope.performance.collectionDate_asString);
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.simpan = function () {
      $scope.performance.year = $scope.selectedMonthData.year;
      $scope.performance.month = $scope.selectedMonthData.month;
      $scope.performance.ski = $scope.selectedSki.value;
      $scope.performance.kompetensiPendukung = $scope.selectedKompetensiPendukung.value;
      $scope.performance.kedisiplinan = $scope.selectedKedisiplinan.value;
      $scope.performance.collectionDate_asString = DateConverterUtils.convertFromDateToString($scope.collectionDate_asDate);
      $scope.placementPromise = $http.post('api/performance/create-penilaian-user-and-timesheet-collection', $scope.performance).success(function (result) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    $scope.openCollectionDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.collectionDateOpened = !$scope.collectionDateOpened;
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-placement').controller('DetailPlacementsController', [
  '$rootScope',
  '$scope',
  '$http',
  '$stateParams',
  'ngDialog',
  'DateConverterUtils',
  function ($rootScope, $scope, $http, $stateParams, ngDialog, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var searchClientWithSpecifiedId = function (clientId) {
      for (var i = 0; i < $scope.clientList.length; i++) {
        if ($scope.clientList[i]._id === clientId) {
          return $scope.clientList[i];
        }
      }
      return null;
    };
    var constructClientNameForResource = function () {
      if ($scope.resource.lastPlacement !== undefined && $scope.resource.lastPlacement !== null) {
        var client = searchClientWithSpecifiedId($scope.resource.lastPlacement.client);
        if (client !== null) {
          $scope.resource.lastPlacement.clientName = client.name;
        }
      }
    };
    var retrieveResourceInfo = function () {
      $scope.resourcePromise = $http({
        method: 'GET',
        url: 'api/resource/' + $stateParams.resourceId
      }).success(function (resource) {
        $scope.resource = resource;
        constructClientNameForResource();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrievePlacementList = function () {
      $scope.placementListPromise = $http({
        method: 'GET',
        url: 'api/placement/resource/' + $stateParams.resourceId
      }).success(function (placementList) {
        $scope.placementList = placementList;
        for (var i = 0; i < placementList.length; i++) {
          placementList[i].fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placementList[i].fromDateReal_asString);
        }
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveClientList = function () {
      $scope.clientListPromise = $http({
        method: 'GET',
        url: 'api/client'
      }).success(function (clientList) {
        $scope.clientList = clientList;
        retrieveResourceInfo();
        retrievePlacementList();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var openExternalPlacementForm = function (aPlacement) {
      ngDialog.open({
        template: '/modules/ero-placement/views/external-placement.view.client.html',
        controller: 'ExternalPlacementController',
        data: JSON.stringify({
          aResource: $scope.resource,
          aPlacement: aPlacement
        })
      });
    };
    var openInternalPlacementForm = function (aPlacement) {
      ngDialog.open({
        template: '/modules/ero-placement/views/internal-placement.view.client.html',
        controller: 'InternalPlacementController',
        data: JSON.stringify({
          aResource: $scope.resource,
          aPlacement: aPlacement
        })
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveClientList();
    };
    $scope.editPlacement = function (aPlacement) {
      if (aPlacement.client.external) {
        openExternalPlacementForm(aPlacement);
      } else {
        openInternalPlacementForm(aPlacement);
      }
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      console.log('Hello, aku di detail-placement');
      retrievePlacementList();
    });
  }
]);'use strict';
angular.module('ero-placement').controller('ExternalPlacementController', [
  '$scope',
  '$http',
  'DateConverterUtils',
  function ($scope, $http, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var retrieveExternalClient = function () {
      $scope.placementPromise = $http.get('api/client/external').success(function (clientList) {
        $scope.clientList = clientList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var isCreateMode = function () {
      return $scope.ngDialogData.aPlacement === undefined || $scope.ngDialogData.aPlacement === null;
    };
    var init = function () {
      retrieveExternalClient();
      // Create Placement
      if (isCreateMode()) {
        $scope.placement = {
          user: $scope.ngDialogData.aResource._id,
          prfNumber: null,
          fromDate_asString: DateConverterUtils.convertFromDateToString(new Date()),
          toDate_asString: DateConverterUtils.convertFromDateToString(new Date()),
          fromDateReal_asString: DateConverterUtils.convertFromDateToString(new Date()),
          timesheetCollectingDate: null,
          client: null,
          placementType: 'new',
          rumpunTechnology: null,
          location: null,
          notes: null
        };
      }  // Edit Placement
      else {
        $scope.placement = {
          placementId: $scope.ngDialogData.aPlacement._id,
          user: $scope.ngDialogData.aResource._id,
          prfNumber: $scope.ngDialogData.aPlacement.prfNumber,
          fromDate_asString: $scope.ngDialogData.aPlacement.fromDate_asString,
          toDate_asString: $scope.ngDialogData.aPlacement.toDate_asString,
          fromDateReal_asString: $scope.ngDialogData.aPlacement.fromDateReal_asString,
          timesheetCollectingDate: $scope.ngDialogData.aPlacement.timesheetCollectingDate,
          client: $scope.ngDialogData.aPlacement.client._id,
          placementType: $scope.ngDialogData.aPlacement.placementType[0],
          rumpunTechnology: $scope.ngDialogData.aPlacement.rumpunTechnology[0],
          location: $scope.ngDialogData.aPlacement.location,
          notes: $scope.ngDialogData.aPlacement.notes
        };
      }
      $scope.placementTypeList = [
        'new',
        'extend',
        'replace',
        'pay absence'
      ];
      $scope.rumpunTechnologyList = [
        'Java',
        '.NET',
        'PHP',
        'Other Developer',
        'System Engineer',
        'Other'
      ];
      $scope.fromDate_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.fromDate_asString);
      $scope.toDate_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.toDate_asString);
      $scope.fromDateReal_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.fromDateReal_asString);
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.simpan = function () {
      $scope.placement.fromDate_asString = DateConverterUtils.convertFromDateToString($scope.fromDate_asDate);
      $scope.placement.toDate_asString = DateConverterUtils.convertFromDateToString($scope.toDate_asDate);
      $scope.placement.fromDateReal_asString = DateConverterUtils.convertFromDateToString($scope.fromDateReal_asDate);
      $scope.placementPromise = $http.post('api/placement', $scope.placement).success(function (result) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    $scope.openFromDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.fromDateOpened = !$scope.fromDateOpened;
    };
    $scope.openToDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.toDateOpened = !$scope.toDateOpened;
    };
    $scope.openFromDateReal = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.fromDateRealOpened = !$scope.fromDateRealOpened;
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-placement').controller('InternalPlacementController', [
  '$scope',
  '$http',
  'DateConverterUtils',
  function ($scope, $http, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var retrieveInternalClient = function () {
      $scope.placementPromise = $http.get('api/client/internal').success(function (clientList) {
        $scope.clientList = clientList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var isCreateMode = function () {
      return $scope.ngDialogData.aPlacement === undefined || $scope.ngDialogData.aPlacement === null;
    };
    var init = function () {
      retrieveInternalClient();
      // Create Placement
      if (isCreateMode()) {
        $scope.placement = {
          user: $scope.ngDialogData.aResource._id,
          fromDateReal_asString: DateConverterUtils.convertFromDateToString(new Date()),
          timesheetCollectingDate: null,
          client: null,
          notes: null
        };
      } else {
        $scope.placement = {
          placementId: $scope.ngDialogData.aPlacement._id,
          user: $scope.ngDialogData.aResource._id,
          fromDateReal_asString: $scope.ngDialogData.aPlacement.fromDateReal_asString,
          timesheetCollectingDate: $scope.ngDialogData.aPlacement.timesheetCollectingDate,
          client: $scope.ngDialogData.aPlacement.client._id,
          notes: $scope.ngDialogData.aPlacement.notes
        };
      }
      $scope.fromDateReal_asDate = DateConverterUtils.convertFromStringToDate($scope.placement.fromDateReal_asString);
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.simpan = function () {
      $scope.placement.fromDateReal_asString = DateConverterUtils.convertFromDateToString($scope.fromDateReal_asDate);
      $scope.placementPromise = $http.post('api/placement', $scope.placement).success(function (result) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    $scope.openFromDateReal = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.fromDateRealOpened = !$scope.fromDateRealOpened;
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-placement').controller('EroPlacementListController', [
  '$rootScope',
  '$scope',
  '$http',
  '$location',
  'ngDialog',
  function ($rootScope, $scope, $http, $location, ngDialog) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var findClientWithSpecifiedId = function (id) {
      for (var i = 0; i < $scope.clientList.length; i++) {
        if ($scope.clientList[i]._id === id) {
          return $scope.clientList[i];
        }
      }
    };
    var matchLastPlacementWithClient = function () {
      for (var i = 0; i < $scope.resourceList.length; i++) {
        if ($scope.resourceList[i].lastPlacement !== undefined && $scope.resourceList[i].lastPlacement !== null) {
          $scope.resourceList[i].lastPlacement.clientName = findClientWithSpecifiedId($scope.resourceList[i].lastPlacement.client).name;
        }
      }
    };
    var retrieveClientList = function () {
      $scope.placementListPromise = $http({
        method: 'GET',
        url: 'api/client'
      }).success(function (clientList) {
        $scope.clientList = clientList;
        matchLastPlacementWithClient();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveResourceList = function () {
      $scope.placementListPromise = $http({
        method: 'GET',
        url: 'api/resource'
      }).success(function (resourceList) {
        $scope.resourceList = resourceList;
        retrieveClientList();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveResourceList();
    };
    $scope.detailPlacements = function (aResource) {
      $location.url('/ero/placement/resource/' + aResource._id);
    };
    $scope.timesheet = function (aResource) {
      $location.url('/ero/timesheet/' + aResource._id);
    };
    $scope.performance = function (aResource) {
      $location.url('/ero/performance/' + aResource._id);
    };
    $scope.projectList = function (aResource) {
      $location.url('/ero/project-list/' + aResource._id);
    };
    $scope.newExternalPlacement = function (aResource) {
      ngDialog.open({
        template: '/modules/ero-placement/views/external-placement.view.client.html',
        controller: 'ExternalPlacementController',
        data: JSON.stringify({ aResource: aResource })
      });
    };
    $scope.newInternalPlacement = function (aResource) {
      ngDialog.open({
        template: '/modules/ero-placement/views/internal-placement.view.client.html',
        controller: 'InternalPlacementController',
        data: JSON.stringify({ aResource: aResource })
      });
    };
    $scope.timesheetCollection = function (aResource) {
      ngDialog.open({
        template: '/modules/ero-placement/views/create-performance-for-penilaian-user-and-timesheet-collection.view.client.html',
        controller: 'CreatePerformanceController',
        data: JSON.stringify({ aResource: aResource })
      });
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      retrieveResourceList();
    });
  }
]);'use strict';
angular.module('ero-placement').controller('ProjectListController', [
  '$rootScope',
  '$scope',
  '$http',
  '$stateParams',
  'ngDialog',
  'DateConverterUtils',
  function ($rootScope, $scope, $http, $stateParams, ngDialog, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var searchClientWithSpecifiedId = function (clientId) {
      for (var i = 0; i < $scope.clientList.length; i++) {
        if ($scope.clientList[i]._id === clientId) {
          return $scope.clientList[i];
        }
      }
      return null;
    };
    var constructClientNameForResource = function () {
      if ($scope.resource.lastPlacement !== undefined && $scope.resource.lastPlacement !== null) {
        var client = searchClientWithSpecifiedId($scope.resource.lastPlacement.client);
        if (client !== null) {
          $scope.resource.lastPlacement.clientName = client.name;
        }
      }
    };
    var retrieveResourceInfo = function () {
      $scope.resourcePromise = $http({
        method: 'GET',
        url: 'api/resource/' + $stateParams.resourceId
      }).success(function (resource) {
        $scope.resource = resource;
        constructClientNameForResource();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveProjectList = function () {
      $scope.projectListPromise = $http({
        method: 'GET',
        url: 'api/project/' + $stateParams.resourceId + '/retrieve'
      }).success(function (projectList) {
        $scope.projectList = projectList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveClientList = function () {
      $scope.clientListPromise = $http({
        method: 'GET',
        url: 'api/client'
      }).success(function (clientList) {
        $scope.clientList = clientList;
        retrieveResourceInfo();
        retrieveProjectList();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveClientList();
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-placement').controller('PerformanceController', [
  '$rootScope',
  '$scope',
  '$http',
  '$stateParams',
  'ngDialog',
  function ($rootScope, $scope, $http, $stateParams, ngDialog) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var calculateTotalPerformance = function () {
      var totalAbsensi = 0;
      var totalBillable = 0;
      var totalTimesheetCollection = 0;
      var totalPenilaianUser = 0;
      var grandTotal = 0;
      for (var i = 0; i < $scope.performanceList.length; i++) {
        var aPerformance = $scope.performanceList[i];
        if (aPerformance.kriteriaPenilaianUser && aPerformance.kriteriaPenilaianUser.kriteriaValue) {
          totalPenilaianUser += aPerformance.kriteriaPenilaianUser.kriteriaValue;
        }
        if (aPerformance.kriteriaTimesheetCollection && aPerformance.kriteriaTimesheetCollection.kriteriaValue) {
          totalTimesheetCollection += aPerformance.kriteriaTimesheetCollection.kriteriaValue;
        }
        if (aPerformance.kriteriaAbsensi && aPerformance.kriteriaAbsensi.kriteriaValue) {
          totalAbsensi += aPerformance.kriteriaAbsensi.kriteriaValue;
        }
        if (aPerformance.kriteriaBillableUtilization && aPerformance.kriteriaBillableUtilization.kriteriaValue) {
          totalBillable += aPerformance.kriteriaBillableUtilization.kriteriaValue;
        }
        if (aPerformance.totalValue) {
          grandTotal += aPerformance.totalValue;
        }
      }
      $scope.totalAbsensi = totalAbsensi;
      $scope.totalBillable = totalBillable;
      $scope.totalTimesheetCollection = totalTimesheetCollection;
      $scope.totalPenilaianUser = totalPenilaianUser;
      $scope.grandTotal = grandTotal;
    };
    var retrieveResourceData = function () {
      $scope.resourcePromise = $http({
        method: 'GET',
        url: 'api/resource/' + $stateParams.resourceId
      }).success(function (resource) {
        $scope.resource = resource;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrievePerformanceData = function () {
      $scope.performancePromise = $http({
        method: 'GET',
        url: 'api/performance/' + $stateParams.resourceId + '/retrieve',
        params: { year: $scope.currentYear }
      }).success(function (result) {
        $scope.performanceList = result.performanceList;
        $scope.year = result.year;
        calculateTotalPerformance();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveResourceData();
      retrievePerformanceData();
    };
    $scope.openDetailAbsensi = function () {
      ngDialog.open({
        template: 'detailAbsensiDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalAbsensi: $scope.totalAbsensi
        })
      });
    };
    $scope.openDetailBillable = function () {
      ngDialog.open({
        template: 'detailBillableDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalBillable: $scope.totalBillable
        })
      });
    };
    $scope.openDetailTimesheetCollection = function () {
      ngDialog.open({
        template: 'detailTimesheetCollectionDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalTimesheetCollection: $scope.totalTimesheetCollection
        })
      });
    };
    $scope.openDetailPenilaianUser = function () {
      ngDialog.open({
        template: 'detailPenilaianUserDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalPenilaianUser: $scope.totalPenilaianUser
        })
      });
    };
    $scope.openDetailPerformance = function () {
      ngDialog.open({
        template: 'detailPerformanceDialog',
        controller: [
          '$scope',
          function ($scope) {
            $scope.updatePerformanceForPenilaianUser = function (aPerformance) {
              ngDialog.open({
                template: '/modules/ero-placement/views/update-performance-for-penilaian-user-and-timesheet-collection.view.client.html',
                controller: 'UpdatePerformanceController',
                data: JSON.stringify({ aPerformance: aPerformance })
              });
            };
          }
        ],
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          grandTotal: $scope.grandTotal
        })
      });
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-placement').controller('UpdatePerformanceController', [
  '$window',
  '$scope',
  '$http',
  'DateConverterUtils',
  function ($window, $scope, $http, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var generatePilihanPenilaianUserList = function () {
      var pilihanPenilaianUserList = [];
      pilihanPenilaianUserList.push({
        name: '(4) Sangat Memuaskan',
        value: 4
      });
      pilihanPenilaianUserList.push({
        name: '(3) Memuaskan',
        value: 3
      });
      pilihanPenilaianUserList.push({
        name: '(2) Tidak Memuaskan',
        value: 2
      });
      pilihanPenilaianUserList.push({
        name: '(1) Sangat Tidak Memuaskan',
        value: 1
      });
      pilihanPenilaianUserList.push({
        name: '(0) Tidak ada nilai',
        value: 0
      });
      $scope.pilihanPenilaianUserList = pilihanPenilaianUserList;
    };
    var init = function () {
      generatePilihanPenilaianUserList();
      $scope.performance = $scope.ngDialogData.aPerformance;
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.simpan = function () {
      console.log('simpan');
      $scope.performance.ski = $scope.selectedSki.value;
      $scope.performance.kompetensiPendukung = $scope.selectedKompetensiPendukung.value;
      $scope.performance.kedisiplinan = $scope.selectedKedisiplinan.value;
      var performance = {
          performanceId: $scope.performance._id,
          ski: $scope.selectedSki.value,
          kompetensiPendukung: $scope.selectedKompetensiPendukung.value,
          kedisiplinan: $scope.selectedKedisiplinan.value,
          collectionDate_asString: DateConverterUtils.convertFromDateToString($scope.collectionDate_asDate),
          timesheetCollectionPerform: $scope.timesheetCollectionPerform
        };
      console.log('performance: ' + performance);
      $scope.placementPromise = $http.post('api/performance/update-penilaian-user-and-timesheet-collection', performance).success(function (result) {
        // $scope.closeThisDialog();
        $window.location.reload();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    $scope.openCollectionDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.collectionDateOpened = !$scope.collectionDateOpened;
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
// Configuring the Articles module
angular.module('ero-resource').run([
  'Menus',
  function (Menus) {
    //function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Resource', 'ero/resource', 'item', 'ero/resource', false, ['ero']);
  }
]);'use strict';
// Setting up route
angular.module('ero-resource').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('ero-resource-list', {
      url: '/ero/resource',
      templateUrl: 'modules/ero-resource/views/list-resource.view.client.html',
      needRole: 'ero'
    });
  }
]);'use strict';
angular.module('ero-resource').controller('ChangePasswordResourceController', [
  '$scope',
  '$http',
  function ($scope, $http) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var init = function () {
      $scope.resource = $scope.ngDialogData.resource;
      $scope.passwordDetails = {
        userId: $scope.resource._id,
        newPassword: null
      };
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================		
    $scope.simpan = function () {
      $scope.formPromise = $http.post('api/resource/change-password', $scope.passwordDetails).success(function (result) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-resource').controller('FormResourceController', [
  '$scope',
  '$http',
  'DateConverterUtils',
  function ($scope, $http, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var createNewResource = function () {
      $scope.formPromise = $http.post('api/resource', $scope.resource).success(function (result) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var updateResource = function () {
      $scope.formPromise = $http.post('api/resource/update', $scope.resource).success(function (resource) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================		
    $scope.init = function () {
      $scope.dialogTitle = $scope.ngDialogData.dialogTitle;
      if ($scope.ngDialogData.resource !== undefined && $scope.ngDialogData.resource !== null) {
        $scope.editMode = true;
        $scope.resource = $scope.ngDialogData.resource;
      } else {
        $scope.resource = {
          _id: null,
          name: null,
          nip: null,
          email: null,
          password: null,
          joinDate_asString: DateConverterUtils.convertFromDateToString(new Date())
        };
      }
      $scope.resource.aktif = true;
      $scope.joinDate_asDate = DateConverterUtils.convertFromStringToDate($scope.resource.joinDate_asString);
      if ($scope.resource.statusKepegawaian && $scope.resource.statusKepegawaian[0] === 'resign') {
        $scope.resource.aktif = false;
      }
    };
    $scope.init();
    $scope.simpan = function () {
      $scope.resource.joinDate_asString = DateConverterUtils.convertFromDateToString($scope.joinDate_asDate);
      if ($scope.resource.aktif) {
        $scope.resource.statusKepegawaian = ['active'];
      } else {
        $scope.resource.statusKepegawaian = ['resign'];
      }
      if ($scope.editMode) {
        updateResource();
      } else {
        createNewResource();
      }
    };
    $scope.openJoinDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = !$scope.opened;
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('ero-resource').controller('EroResourceListController', [
  '$rootScope',
  '$scope',
  '$http',
  'ngDialog',
  function ($rootScope, $scope, $http, ngDialog) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var retrieveResourceList = function () {
      $scope.resourceListPromise = $http({
        method: 'GET',
        url: 'api/resource'
      }).success(function (resourceList) {
        $scope.resourceList = resourceList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveResourceList();
    };
    $scope.openTambahResourceDialog = function () {
      ngDialog.open({
        template: '/modules/ero-resource/views/form-resource.view.client.html',
        controller: 'FormResourceController',
        data: JSON.stringify({ dialogTitle: 'Tambah Resource' })
      });
    };
    $scope.openEditResourceDialog = function (resource) {
      ngDialog.open({
        template: '/modules/ero-resource/views/form-resource.view.client.html',
        controller: 'FormResourceController',
        data: JSON.stringify({
          dialogTitle: 'Edit Resource',
          resource: resource
        })
      });
    };
    $scope.openChangePasswordResourceDialog = function (resource) {
      ngDialog.open({
        template: '/modules/ero-resource/views/change-password.view.client.html',
        controller: 'ChangePasswordResourceController',
        data: JSON.stringify({ resource: resource })
      });
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      retrieveResourceList();
    });
  }
]);'use strict';
// Configuring the Articles module
angular.module('ero-timesheet-template').run([
  'Menus',
  function (Menus) {
    //function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Timesheet Template', 'ero/timesheet-template', 'item', 'ero/timesheet-template', false, ['ero']);
  }
]);'use strict';
// Setting up route
angular.module('ero-timesheet-template').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('ero-timesheet-template', {
      url: '/ero/timesheet-template',
      templateUrl: 'modules/ero-timesheet-template/views/list-timesheet-template.view.client.html',
      needRole: 'ero'
    });
  }
]);'use strict';
angular.module('ero-timesheet-template').controller('EroTimesheetTemplateListController', [
  '$scope',
  '$http',
  function ($scope, $http) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var retrieveYearList = function () {
      $scope.yearListPromise = $http({
        method: 'GET',
        url: 'api/timesheet-template/retrieve-years'
      }).success(function (yearList) {
        $scope.yearList = yearList;
        selectYear();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var selectYear = function () {
      $scope.selectedYear = null;
      for (var i = 0; i < $scope.yearList.length; i++) {
        if ($scope.yearList[i].currentYear) {
          $scope.selectedYear = $scope.yearList[i];
        }
      }
    };
    var retrieveTimesheetTempateById = function (id) {
      $scope.timesheetTemplatePromise = $http({
        method: 'GET',
        url: 'api/timesheet-template/' + id
      }).success(function (timesheetTemplate) {
        $scope.timesheetTemplate = timesheetTemplate;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var initiateStatusList = function () {
      $scope.statusList = [
        'Masuk',
        'Libur',
        'Cuti'
      ];
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      initiateStatusList();
      retrieveYearList();
    };
    $scope.updateTimesheetTemplate = function () {
      $scope.timesheetTemplatePromise = $http.post('api/timesheet-template/', $scope.timesheetTemplate).success(function () {
        retrieveTimesheetTempateById($scope.timesheetTemplate._id);
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $scope.$watch('selectedYear', function () {
      if ($scope.selectedYear !== undefined && $scope.selectedYear !== null) {
        var id = $scope.selectedYear._id;
        retrieveTimesheetTempateById(id);
      }
    }, true);
  }
]);'use strict';
// Setting up route
angular.module('ero-timesheet').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('ero-timesheet', {
      url: '/ero/timesheet/:resourceId',
      templateUrl: 'modules/ero-timesheet/views/list-timesheet.view.client.html',
      needRole: 'ero'
    });
  }
]);'use strict';
angular.module('ero-timesheet').controller('EroDetailTimesheetController', [
  '$scope',
  function ($scope) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var init = function () {
      $scope.timesheet = $scope.ngDialogData.timesheet;
    };
    init();  // =====================================================================
             // $scope Member
             // =====================================================================		
             // =====================================================================
             // Event listener
             // =====================================================================
  }
]);'use strict';
angular.module('ero-timesheet').controller('EroFormTimesheetController', [
  '$scope',
  '$http',
  '$stateParams',
  'DateConverterUtils',
  function ($scope, $http, $stateParams, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var onboardDateTimeline = [];
    var orderPlacementListByDate = function (placementList) {
      placementList.sort(function (placement1, placement2) {
        var placement1_fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placement1.fromDateReal_asString);
        var placement2_fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placement2.fromDateReal_asString);
        return placement1_fromDateReal_asDate.getTime() - placement2_fromDateReal_asDate.getTime();
      });
    };
    var generateOnboardDateTimeline = function (placementList) {
      orderPlacementListByDate(placementList);
      if (placementList.length > 0) {
        for (var i = 0; i < placementList.length; i++) {
          onboardDateTimeline.push({
            onboardDate: DateConverterUtils.convertFromStringToDate(placementList[i].fromDateReal_asString),
            placementData: placementList[i]
          });
        }
        // Assign last timeline
        if (placementList[placementList.length - 1].client.external) {
          onboardDateTimeline.push({
            onboardDate: DateConverterUtils.convertFromStringToDate(placementList[placementList.length - 1].toDate_asString),
            placementData: placementList[placementList.length - 1]
          });
        } else {
          onboardDateTimeline.push({
            onboardDate: new Date(),
            placementData: placementList[placementList.length - 1]
          });
        }
        // Add 1 milisecond to last onboardDateTimeline. Important for matchingPlacementData() function
        onboardDateTimeline[onboardDateTimeline.length - 1].onboardDate = new Date(onboardDateTimeline[onboardDateTimeline.length - 1].onboardDate.getTime() + 1);
      }
    };
    var matchingPlacementData = function () {
      $scope.matchedPlacement = null;
      var tanggalTimesheet = $scope.tanggal_asDate;
      for (var i = 0; i < onboardDateTimeline.length - 1; i++) {
        if (onboardDateTimeline[i].onboardDate.getTime() <= tanggalTimesheet.getTime() && tanggalTimesheet.getTime() < onboardDateTimeline[i + 1].onboardDate.getTime()) {
          $scope.matchedPlacement = onboardDateTimeline[i].placementData;
          return;
        }
      }
    };
    var updateTimesheet = function () {
      if ($scope.timesheet.statusAbsensi !== 'Masuk') {
        $scope.timesheet.jamKerjaMulai = null;
        $scope.timesheet.jamKerjaSelesai = null;
        $scope.timesheet.jamOTMulai = null;
        $scope.timesheet.jamOTSelesai = null;
      }
      $scope.formPromise = $http.post('api/timesheet/' + $stateParams.resourceId + '/update', $scope.timesheet).success(function (timesheet) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================		
    $scope.init = function () {
      // Placement list related
      $scope.placementList = $scope.ngDialogData.placementList;
      generateOnboardDateTimeline($scope.placementList);
      // Timesheet related
      $scope.timesheet = $scope.ngDialogData.timesheet;
      $scope.tanggal_asDate = DateConverterUtils.convertFromStringToDate($scope.timesheet.tanggal_asString);
    };
    $scope.init();
    $scope.simpan = function () {
      if ($scope.matchedPlacement !== null) {
        $scope.timesheet.placement = $scope.matchedPlacement._id;
        updateTimesheet();
      }
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $scope.$watch('tanggal_asDate', function () {
      if ($scope.placementList !== null && $scope.placementList !== undefined) {
        matchingPlacementData();
      }
    }, true);
  }
]);'use strict';
angular.module('ero-timesheet').controller('EroTimesheetListController', [
  '$rootScope',
  '$scope',
  '$http',
  '$stateParams',
  '$location',
  'ngDialog',
  'DateConverterUtils',
  function ($rootScope, $scope, $http, $stateParams, $location, ngDialog, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var generateMonthDataList = function () {
      $scope.monthDataList = [];
      var monthNames = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember'
        ];
      var today = new Date();
      var month = today.getMonth();
      var year = today.getFullYear();
      $scope.monthDataList.push({
        name: year + ', ' + monthNames[month],
        year: year,
        month: month
      });
      for (var i = 0; i < 23; i++) {
        month = month - 1;
        if (month < 0) {
          month = 11;
          year = year - 1;
        }
        $scope.monthDataList.push({
          name: year + ', ' + monthNames[month],
          year: year,
          month: month
        });
      }
    };
    var findPlacementForSpecifiedId = function (placementList, id) {
      for (var i = 0; i < placementList.length; i++) {
        if (placementList[i]._id === id) {
          return placementList[i];
        }
      }
      return null;
    };
    var isTimesheetEditable = function (tanggalTimesheet) {
      return true;
    };
    var matchingTimesheetWithPlacement = function (timesheetList, placementList) {
      for (var i = 0; i < timesheetList.length; i++) {
        timesheetList[i].placement = findPlacementForSpecifiedId(placementList, timesheetList[i].placement);
        timesheetList[i].editable = isTimesheetEditable(timesheetList[i].tanggal_asDate);
      }
    };
    var retrieveInitData = function () {
      $scope.timesheetListPromise = $http({
        method: 'GET',
        url: 'api/placement/resource/' + $stateParams.resourceId
      }).success(function (placementList) {
        $scope.placementList = placementList;
        generateMonthDataList();
        $scope.selectedMonthData = $scope.monthDataList[0];
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveTimesheetByMonth = function (year, month) {
      $scope.timesheetListPromise = $http({
        method: 'GET',
        url: 'api/timesheet/' + $stateParams.resourceId + '/retrieve-by-month/',
        params: {
          year: year,
          month: month
        }
      }).success(function (timesheetList) {
        for (var i = 0; i < timesheetList.length; i++) {
          timesheetList[i].tanggal_asDate = DateConverterUtils.convertFromStringToDate(timesheetList[i].tanggal_asString);
        }
        matchingTimesheetWithPlacement(timesheetList, $scope.placementList);
        $scope.timesheetList = timesheetList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveTimesheet = function () {
      if ($scope.selectedMonthData !== undefined && $scope.selectedMonthData !== null) {
        retrieveTimesheetByMonth($scope.selectedMonthData.year, $scope.selectedMonthData.month);
      }
    };
    var retrieveResourceData = function () {
      $scope.resourcePromise = $http({
        method: 'GET',
        url: 'api/resource/' + $stateParams.resourceId
      }).success(function (resource) {
        $scope.resource = resource;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveInitData();
      retrieveResourceData();
    };
    $scope.openEditTimesheetDialog = function (timesheet) {
      ngDialog.open({
        template: '/modules/ero-timesheet/views/form-timesheet.view.client.html',
        controller: 'EroFormTimesheetController',
        data: JSON.stringify({
          placementList: $scope.placementList,
          timesheet: timesheet
        })
      });
    };
    $scope.openDetailTimesheetDialog = function (timesheet) {
      ngDialog.open({
        template: '/modules/ero-timesheet/views/detail-timesheet.view.client.html',
        controller: 'EroDetailTimesheetController',
        data: JSON.stringify({ timesheet: timesheet })
      });
    };
    $scope.openPrintTimesheetDialog = function () {
      ngDialog.open({
        template: '/modules/ero-timesheet/views/print-timesheet.view.client.html',
        controller: 'EroPrintTimesheetController'
      });
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      retrieveTimesheet();
    });
    $scope.$watch('selectedMonthData', function () {
      retrieveTimesheet();
    }, true);
  }
]);'use strict';
angular.module('ero-timesheet').controller('EroPrintTimesheetController', [
  '$scope',
  '$stateParams',
  'DateConverterUtils',
  function ($scope, $stateParams, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var init = function () {
      $scope.startDate_asDate = DateConverterUtils.todayAsDate();
      $scope.endDate_asDate = DateConverterUtils.todayAsDate();
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.openStartDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.startDateOpened = !$scope.startDateOpened;
    };
    $scope.openEndDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.endDateOpened = !$scope.endDateOpened;
    };
    $scope.printTimesheet = function () {
      // var startDate_asTime = $scope.startDate_asDate.getTime();
      // var endDate_asTime = $scope.endDate_asDate.getTime();
      // console.log(startDate_asString, endDate_asString);
      var startDate_asString = DateConverterUtils.convertFromDateToString($scope.startDate_asDate);
      var endDate_asString = DateConverterUtils.convertFromDateToString($scope.endDate_asDate);
      var timesheetUrl = '/api/timesheet/' + $stateParams.resourceId + '/retrieve-pdf/' + startDate_asString + '/' + endDate_asString;
      window.open(timesheetUrl, '_blank');
      $scope.closeThisDialog();
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
// Setting up route
angular.module('timesheet').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('resource-home', {
      url: '/resource/home',
      templateUrl: 'modules/resource-home/views/home.view.client.html',
      needRole: 'resource'
    });
  }
]);'use strict';
angular.module('timesheet').controller('ResourceHomeController', [
  '$scope',
  '$http',
  'ngDialog',
  function ($scope, $http, ngDialog) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var calculateTotalPerformance = function () {
      var totalAbsensi = 0;
      var totalBillable = 0;
      var totalTimesheetCollection = 0;
      var totalPenilaianUser = 0;
      var grandTotal = 0;
      for (var i = 0; i < $scope.performanceList.length; i++) {
        var aPerformance = $scope.performanceList[i];
        if (aPerformance.kriteriaPenilaianUser && aPerformance.kriteriaPenilaianUser.kriteriaValue) {
          totalPenilaianUser += aPerformance.kriteriaPenilaianUser.kriteriaValue;
        }
        if (aPerformance.kriteriaTimesheetCollection && aPerformance.kriteriaTimesheetCollection.kriteriaValue) {
          totalTimesheetCollection += aPerformance.kriteriaTimesheetCollection.kriteriaValue;
        }
        if (aPerformance.kriteriaAbsensi && aPerformance.kriteriaAbsensi.kriteriaValue) {
          totalAbsensi += aPerformance.kriteriaAbsensi.kriteriaValue;
        }
        if (aPerformance.kriteriaBillableUtilization && aPerformance.kriteriaBillableUtilization.kriteriaValue) {
          totalBillable += aPerformance.kriteriaBillableUtilization.kriteriaValue;
        }
        if (aPerformance.totalValue) {
          grandTotal += aPerformance.totalValue;
        }
      }
      $scope.totalAbsensi = totalAbsensi;
      $scope.totalBillable = totalBillable;
      $scope.totalTimesheetCollection = totalTimesheetCollection;
      $scope.totalPenilaianUser = totalPenilaianUser;
      $scope.grandTotal = grandTotal;
    };
    var init = function () {
      $scope.performancePromise = $http({
        method: 'GET',
        url: 'api/performance/retrieve'
      }).success(function (result) {
        $scope.performanceList = result.performanceList;
        $scope.year = result.year;
        calculateTotalPerformance();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.openDetailAbsensi = function () {
      ngDialog.open({
        template: 'detailAbsensiDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalAbsensi: $scope.totalAbsensi
        })
      });
    };
    $scope.openDetailBillable = function () {
      ngDialog.open({
        template: 'detailBillableDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalBillable: $scope.totalBillable
        })
      });
    };
    $scope.openDetailTimesheetCollection = function () {
      ngDialog.open({
        template: 'detailTimesheetCollectionDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalTimesheetCollection: $scope.totalTimesheetCollection
        })
      });
    };
    $scope.openDetailPenilaianUser = function () {
      ngDialog.open({
        template: 'detailPenilaianUserDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          totalPenilaianUser: $scope.totalPenilaianUser
        })
      });
    };
    $scope.openDetailPerformance = function () {
      ngDialog.open({
        template: 'detailPerformanceDialog',
        data: JSON.stringify({
          performanceList: $scope.performanceList,
          grandTotal: $scope.grandTotal
        })
      });
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
// Configuring the Articles module
angular.module('resource-project').run([
  'Menus',
  function (Menus) {
    //function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Project', 'resource/project', 'item', 'resource/project', false, ['resource']);
  }
]);'use strict';
// Setting up route
angular.module('resource-project').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('resource-project-list', {
      url: '/resource/project',
      templateUrl: 'modules/resource-project/views/list.project.view.client.html',
      needRole: 'resource'
    });
  }
]);'use strict';
angular.module('resource-project').controller('FormProjectController', [
  '$scope',
  '$http',
  function ($scope, $http) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var createNewProject = function () {
      $scope.formPromise = $http.post('api/project/create', $scope.project).success(function (result) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var updateProject = function () {
      $scope.formPromise = $http.post('api/project/update', $scope.project).success(function (project) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================		
    $scope.init = function () {
      $scope.dialogTitle = $scope.ngDialogData.dialogTitle;
      if ($scope.ngDialogData.project !== undefined && $scope.ngDialogData.project !== null) {
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
    $scope.simpan = function () {
      if ($scope.editMode) {
        updateProject();
      } else {
        createNewProject();
      }
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
angular.module('resource-project').controller('ResourceProjectListController', [
  '$rootScope',
  '$scope',
  '$http',
  'ngDialog',
  function ($rootScope, $scope, $http, ngDialog) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var retrieveProjectList = function () {
      $scope.projectListPromise = $http({
        method: 'GET',
        url: 'api/project/retrieve'
      }).success(function (projectList) {
        $scope.projectList = projectList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveProjectList();
    };
    $scope.openTambahProjectDialog = function () {
      ngDialog.open({
        template: '/modules/resource-project/views/form.project.view.client.html',
        controller: 'FormProjectController',
        data: JSON.stringify({ dialogTitle: 'Tambah Project' })
      });
    };
    $scope.openEditProjectDialog = function (project) {
      ngDialog.open({
        template: '/modules/resource-project/views/form.project.view.client.html',
        controller: 'FormProjectController',
        data: JSON.stringify({
          dialogTitle: 'Edit Project',
          project: project
        })
      });
    };
    $scope.deleteProject = function (project) {
      $http({
        method: 'POST',
        url: 'api/project/' + project._id + '/delete'
      }).success(function () {
        retrieveProjectList();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      retrieveProjectList();
    });
  }
]);'use strict';
// Configuring the Articles module
angular.module('timesheet').run([
  'Menus',
  function (Menus) {
    //function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles)
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Timesheet', 'resource/timesheet', 'item', 'resource/timesheet', false, ['resource']);
  }
]);'use strict';
// Setting up route
angular.module('timesheet').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('timesheet', {
      url: '/resource/timesheet',
      templateUrl: 'modules/resource-timesheet/views/list-timesheet.view.client.html',
      needRole: 'resource'
    });
  }
]);'use strict';
angular.module('timesheet').controller('DetailTimesheetController', [
  '$scope',
  function ($scope) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var init = function () {
      $scope.timesheet = $scope.ngDialogData.timesheet;
    };
    init();  // =====================================================================
             // $scope Member
             // =====================================================================		
             // =====================================================================
             // Event listener
             // =====================================================================
  }
]);'use strict';
angular.module('timesheet').controller('FormTimesheetController', [
  '$scope',
  '$http',
  'DateConverterUtils',
  function ($scope, $http, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var onboardDateTimeline = [];
    var orderPlacementListByDate = function (placementList) {
      placementList.sort(function (placement1, placement2) {
        var placement1_fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placement1.fromDateReal_asString);
        var placement2_fromDateReal_asDate = DateConverterUtils.convertFromStringToDate(placement2.fromDateReal_asString);
        return placement1_fromDateReal_asDate.getTime() - placement2_fromDateReal_asDate.getTime();
      });
    };
    var generateOnboardDateTimeline = function (placementList) {
      orderPlacementListByDate(placementList);
      if (placementList.length > 0) {
        for (var i = 0; i < placementList.length; i++) {
          onboardDateTimeline.push({
            onboardDate: DateConverterUtils.convertFromStringToDate(placementList[i].fromDateReal_asString),
            placementData: placementList[i]
          });
        }
        // Assign last timeline
        if (placementList[placementList.length - 1].client.external) {
          onboardDateTimeline.push({
            onboardDate: DateConverterUtils.convertFromStringToDate(placementList[placementList.length - 1].toDate_asString),
            placementData: placementList[placementList.length - 1]
          });
        } else {
          onboardDateTimeline.push({
            onboardDate: new Date(),
            placementData: placementList[placementList.length - 1]
          });
        }
        // Add 1 milisecond to last onboardDateTimeline. Important for matchingPlacementData() function
        onboardDateTimeline[onboardDateTimeline.length - 1].onboardDate = new Date(onboardDateTimeline[onboardDateTimeline.length - 1].onboardDate.getTime() + 1);
      }
    };
    var matchingPlacementData = function () {
      $scope.matchedPlacement = null;
      var tanggalTimesheet = $scope.tanggal_asDate;
      for (var i = 0; i < onboardDateTimeline.length - 1; i++) {
        if (onboardDateTimeline[i].onboardDate.getTime() <= tanggalTimesheet.getTime() && tanggalTimesheet.getTime() < onboardDateTimeline[i + 1].onboardDate.getTime()) {
          $scope.matchedPlacement = onboardDateTimeline[i].placementData;
          return;
        }
      }
    };
    var updateTimesheet = function () {
      if ($scope.timesheet.statusAbsensi !== 'Masuk') {
        $scope.timesheet.jamKerjaMulai = null;
        $scope.timesheet.jamKerjaSelesai = null;
        $scope.timesheet.jamOTMulai = null;
        $scope.timesheet.jamOTSelesai = null;
      }
      $scope.formPromise = $http.post('api/timesheet/update', $scope.timesheet).success(function (timesheet) {
        $scope.closeThisDialog();
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    // =====================================================================
    // $scope Member
    // =====================================================================		
    $scope.init = function () {
      // Placement list related
      $scope.placementList = $scope.ngDialogData.placementList;
      generateOnboardDateTimeline($scope.placementList);
      // Timesheet related
      $scope.timesheet = $scope.ngDialogData.timesheet;
      $scope.tanggal_asDate = DateConverterUtils.convertFromStringToDate($scope.timesheet.tanggal_asString);
    };
    $scope.init();
    $scope.simpan = function () {
      if ($scope.matchedPlacement !== null) {
        $scope.timesheet.placement = $scope.matchedPlacement._id;
        updateTimesheet();
      }
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $scope.$watch('tanggal_asDate', function () {
      if ($scope.placementList !== null && $scope.placementList !== undefined) {
        matchingPlacementData();
      }
    }, true);
  }
]);'use strict';
angular.module('timesheet').controller('TimesheetListController', [
  '$rootScope',
  '$scope',
  '$http',
  '$location',
  'ngDialog',
  'DateConverterUtils',
  function ($rootScope, $scope, $http, $location, ngDialog, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var generateMonthDataList = function () {
      $scope.monthDataList = [];
      var monthNames = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember'
        ];
      var today = new Date();
      var month = today.getMonth();
      var year = today.getFullYear();
      $scope.monthDataList.push({
        name: year + ', ' + monthNames[month],
        year: year,
        month: month
      });
      for (var i = 0; i < 23; i++) {
        month = month - 1;
        if (month < 0) {
          month = 11;
          year = year - 1;
        }
        $scope.monthDataList.push({
          name: year + ', ' + monthNames[month],
          year: year,
          month: month
        });
      }
    };
    var findPlacementForSpecifiedId = function (placementList, id) {
      for (var i = 0; i < placementList.length; i++) {
        if (placementList[i]._id === id) {
          return placementList[i];
        }
      }
      return null;
    };
    var isTimesheetEditable = function (tanggalTimesheet) {
      var tanggalTimesheetAsDate = new Date(tanggalTimesheet);
      var currentAsDate = new Date();
      var aWeekAgoAsDate = new Date();
      aWeekAgoAsDate.setDate(currentAsDate.getDate() - 7);
      return aWeekAgoAsDate <= tanggalTimesheetAsDate && tanggalTimesheetAsDate <= currentAsDate;  // return true;
    };
    var matchingTimesheetWithPlacement = function (timesheetList, placementList) {
      for (var i = 0; i < timesheetList.length; i++) {
        timesheetList[i].placement = findPlacementForSpecifiedId(placementList, timesheetList[i].placement);
        timesheetList[i].editable = isTimesheetEditable(timesheetList[i].tanggal_asDate);
      }
    };
    var retrieveInitData = function () {
      $scope.timesheetListPromise = $http({
        method: 'GET',
        url: 'api/placement'
      }).success(function (placementList) {
        $scope.placementList = placementList;
        generateMonthDataList();
        $scope.selectedMonthData = $scope.monthDataList[0];
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveTimesheetByMonth = function (year, month) {
      $scope.timesheetListPromise = $http({
        method: 'GET',
        url: 'api/timesheet/retrieve-by-month/',
        params: {
          year: year,
          month: month
        }
      }).success(function (timesheetList) {
        for (var i = 0; i < timesheetList.length; i++) {
          timesheetList[i].tanggal_asDate = DateConverterUtils.convertFromStringToDate(timesheetList[i].tanggal_asString);
        }
        matchingTimesheetWithPlacement(timesheetList, $scope.placementList);
        $scope.timesheetList = timesheetList;
      }).error(function (err) {
        $scope.error = err.data.message;
      });
    };
    var retrieveTimesheet = function () {
      if ($scope.selectedMonthData !== undefined && $scope.selectedMonthData !== null) {
        retrieveTimesheetByMonth($scope.selectedMonthData.year, $scope.selectedMonthData.month);
      }
    };
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.prepare = function () {
      retrieveInitData();
    };
    $scope.openEditTimesheetDialog = function (timesheet) {
      ngDialog.open({
        template: '/modules/resource-timesheet/views/form-timesheet.view.client.html',
        controller: 'FormTimesheetController',
        data: JSON.stringify({
          placementList: $scope.placementList,
          timesheet: timesheet
        })
      });
    };
    $scope.openDetailTimesheetDialog = function (timesheet) {
      ngDialog.open({
        template: '/modules/resource-timesheet/views/detail-timesheet.view.client.html',
        controller: 'DetailTimesheetController',
        data: JSON.stringify({ timesheet: timesheet })
      });
    };
    // $scope.openPrintTimesheetDialog = function() {
    // 	$scope.timesheetListPromise = $http({method: 'GET', url:'api/project/retrieve'}).
    // 		success(function(projectList) {
    // 			if(projectList !== undefined && projectList !== null && projectList.length > 0) {
    // 				ngDialog.open({
    // 				    template: '/modules/resource-timesheet/views/print-timesheet.view.client.html',
    // 				    controller: 'PrintTimesheetController'
    // 				});
    // 			} else {
    // 				ngDialog.open({
    // 				    template: '<center><p>Mohon maaf, data project anda masih kosong.<br>' +
    // 				    		  ' Anda harus mengisi data project anda selama di Xsis agar dapat melakukan pencetakan timesheet.</p><br>' +
    // 				    		  '<button type="button" data-ng-click="redirectToProjectPage()" class="btn btn-info btn-xs">Goto Project Page</button></center>',
    // 				    plain: true,
    // 				    controller: ['$scope', '$location', function($scope, $location) {
    // 				        $scope.redirectToProjectPage = function() {
    // 				        	$scope.closeThisDialog();
    // 				        	$location.path("/resource/project");
    // 				        };
    // 				    }]
    // 				});
    // 			}
    //    		}).
    //    		error(function(err) {
    //      			$scope.error = err.data.message;
    //  			}
    //  		);
    // };
    $scope.openPrintTimesheetDialog = function () {
      ngDialog.open({
        template: '/modules/resource-timesheet/views/print-timesheet.view.client.html',
        controller: 'PrintTimesheetController'
      });
    };
    // =====================================================================
    // Event listener
    // =====================================================================
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      retrieveTimesheet();
    });
    $scope.$watch('selectedMonthData', function () {
      retrieveTimesheet();
    }, true);
  }
]);'use strict';
angular.module('timesheet').controller('PrintTimesheetController', [
  '$scope',
  'DateConverterUtils',
  function ($scope, DateConverterUtils) {
    // =====================================================================
    // Non $scope member
    // =====================================================================
    var init = function () {
      $scope.startDate_asDate = DateConverterUtils.todayAsDate();
      $scope.endDate_asDate = DateConverterUtils.todayAsDate();
    };
    init();
    // =====================================================================
    // $scope Member
    // =====================================================================
    $scope.openStartDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.startDateOpened = !$scope.startDateOpened;
    };
    $scope.openEndDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.endDateOpened = !$scope.endDateOpened;
    };
    $scope.printTimesheet = function () {
      var startDate_asString = DateConverterUtils.convertFromDateToString($scope.startDate_asDate);
      var endDate_asString = DateConverterUtils.convertFromDateToString($scope.endDate_asDate);
      var timesheetUrl = '/api/timesheet/retrieve-pdf/' + startDate_asString + '/' + endDate_asString;
      window.open(timesheetUrl, '_blank');
      $scope.closeThisDialog();
    };  // =====================================================================
        // Event listener
        // =====================================================================
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.view.client.html',
      needRole: 'mustBeNotLogged'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/change-password.view.client.html',
      needRole: 'mustBeLogged'
    });
  }
]);'use strict';
angular.module('users').controller('ChangePasswordController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = false;
      if ($scope.passwordDetails.newPassword !== $scope.passwordDetails.verifyPassword) {
        isValid = false;
        $scope.notMatchPassword = true;
      } else {
        $scope.notMatchPassword = false;
      }
      if (isValid) {
        $scope.success = $scope.error = null;
        $scope.settingsPromise = $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
          // If successful show success message and clear form
          $scope.success = true;
          $scope.passwordDetails = null;
          $scope.changePasswordForm.$setPristine();
        }).error(function (response) {
          $scope.error = response.message;
        });
      }
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);