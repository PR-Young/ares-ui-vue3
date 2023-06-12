angular.module('activitiModeler').controller('ActivitiSignalRefCtrl', ['$scope', function ($scope) {

  // Find the parent shape on which the signal definitions are defined
  var signalDefinitionsProperty = undefined;
  var parent = $scope.selectedShape;
  while (parent !== null && parent !== undefined && signalDefinitionsProperty === undefined) {
    if (parent.properties && parent.properties['oryx-signaldefinitions']) {
      signalDefinitionsProperty = parent.properties['oryx-signaldefinitions'];
    } else {
      parent = parent.parent;
    }
  }

  try {
    signalDefinitionsProperty = JSON.parse(signalDefinitionsProperty);
    if (typeof signalDefinitionsProperty == 'string') {
      signalDefinitionsProperty = JSON.parse(signalDefinitionsProperty);
    }
  } catch (err) {
    // Do nothing here, just to be sure we try-catch it
  }

  $scope.signalDefinitions = signalDefinitionsProperty;


  $scope.signalChanged = function () {
    $scope.updatePropertyInModel($scope.property);
  };
}]);
