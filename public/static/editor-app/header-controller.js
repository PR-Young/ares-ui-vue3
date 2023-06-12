'use strict';

angular.module('activitiModeler')
  .controller('HeaderController', ['$rootScope', '$scope', '$http', '$timeout', function ($rootScope, $scope, $http, $timeout) {

    // Add reference to global header-config
    $scope.headerConfig = KISBPM.HEADER_CONFIG;

    // TODO: generate setting-menu items

    // TODO: generate user-menu items

  }]);
