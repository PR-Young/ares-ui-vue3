angular.module('activitiModeler').controller('ActivitiMessageRefCtrl', ['$scope', function ($scope) {

  // Find the parent shape on which the message definitions are defined
  var messageDefinitionsProperty = undefined;
  var parent = $scope.selectedShape;
  while (parent !== null && parent !== undefined && messageDefinitionsProperty === undefined) {
    if (parent.properties && parent.properties['oryx-messagedefinitions']) {
      messageDefinitionsProperty = parent.properties['oryx-messagedefinitions'];
    } else {
      parent = parent.parent;
    }
  }

  try {
    messageDefinitionsProperty = JSON.parse(messageDefinitionsProperty);
    if (typeof messageDefinitionsProperty == 'string') {
      messageDefinitionsProperty = JSON.parse(messageDefinitionsProperty);
    }
  } catch (err) {
    // Do nothing here, just to be sure we try-catch it
  }

  $scope.messageDefinitions = messageDefinitionsProperty;


  $scope.messageChanged = function () {
    $scope.updatePropertyInModel($scope.property);
  };
}]);
