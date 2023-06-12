/*
 * Execution listeners
 */

angular.module('activitiModeler').controller('ActivitiMessageDefinitionsCtrl', ['$scope', '$modal', function ($scope, $modal) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/message-definitions-popup.html?version=' + Date.now(),
    scope: $scope
  };

  // Open the dialog
  $modal(opts);
}]);

//Need a separate controller for the modal window due to https://github.com/angular-ui/bootstrap/issues/259
// Will be fixed in a newer version of Angular UI
angular.module('activitiModeler').controller('ActivitiMessageDefinitionsPopupCtrl',
  ['$scope', '$q', '$translate', '$timeout', function ($scope, $q, $translate, $timeout) {

    // Put json representing mesage definitions on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null && $scope.property.value.length > 0) {

      if ($scope.property.value.constructor == String) {
        $scope.messageDefinitions = JSON.parse($scope.property.value);
      } else {
        // Note that we clone the json object rather then setting it directly,
        // this to cope with the fact that the user can click the cancel button and no changes should have happened
        $scope.messageDefinitions = angular.copy($scope.property.value);
      }

    } else {
      $scope.messageDefinitions = [];
    }

    // Array to contain selected mesage definitions (yes - we only can select one, but ng-grid isn't smart enough)
    $scope.selectedMessages = [];
    $scope.translationsRetrieved = false;

    $scope.labels = {};

    var idPromise = $translate('PROPERTY.MESSAGEDEFINITIONS.ID');
    var namePromise = $translate('PROPERTY.MESSAGEDEFINITIONS.NAME');

    $q.all([idPromise, namePromise]).then(function (results) {

      $scope.labels.idLabel = results[0];
      $scope.labels.nameLabel = results[1];
      $scope.translationsRetrieved = true;

      // Config for grid
      $scope.gridOptions = {
        data: 'messageDefinitions',
        headerRowHeight: 28,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        keepLastSelected: false,
        selectedItems: $scope.selectedMessages,
        columnDefs: [
          {field: 'id', displayName: $scope.labels.idLabel},
          {field: 'name', displayName: $scope.labels.nameLabel}]
      };
    });

    // Click handler for add button
    $scope.addNewMessageDefinition = function () {
      var newMessageDefinition = {id: '', name: ''};

      $scope.messageDefinitions.push(newMessageDefinition);
      $timeout(function () {
        $scope.gridOptions.selectItem($scope.messageDefinitions.length - 1, true);
      });
    };

    // Click handler for remove button
    $scope.removeMessageDefinition = function () {
      if ($scope.selectedMessages && $scope.selectedMessages.length > 0) {
        var index = $scope.messageDefinitions.indexOf($scope.selectedMessages[0]);
        $scope.gridOptions.selectItem(index, false);
        $scope.messageDefinitions.splice(index, 1);

        $scope.selectedMessages.length = 0;
        if (index < $scope.messageDefinitions.length) {
          $scope.gridOptions.selectItem(index + 1, true);
        } else if ($scope.messageDefinitions.length > 0) {
          $scope.gridOptions.selectItem(index - 1, true);
        }
      }
    };

    // Click handler for save button
    $scope.save = function () {

      if ($scope.messageDefinitions.length > 0) {
        $scope.property.value = $scope.messageDefinitions;
      } else {
        $scope.property.value = null;
      }

      $scope.updatePropertyInModel($scope.property);
      $scope.close();
    };

    $scope.cancel = function () {
      $scope.property.mode = 'read';
      $scope.$hide();
    };

    // Close button handler
    $scope.close = function () {
      $scope.property.mode = 'read';
      $scope.$hide();
    };

  }]);
