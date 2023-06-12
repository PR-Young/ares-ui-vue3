/*
 * Condition expression
 */

var KisBpmConditionExpressionCtrl = ['$scope', '$modal', function ($scope, $modal) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
    scope: $scope
  };

  // Open the dialog
  $modal(opts);
}];

var KisBpmConditionExpressionPopupCtrl = ['$scope', '$translate', '$http', function ($scope, $translate, $http) {

  // Put json representing condition on scope
  if ($scope.property.value !== undefined && $scope.property.value !== null) {

    $scope.conditionExpression = {value: $scope.property.value};

  } else {
    $scope.conditionExpression = {value: ''};
  }

  $scope.save = function () {
    $scope.property.value = $scope.conditionExpression.value;
    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    $scope.property.mode = 'read';
    $scope.$hide();
  };
}];
