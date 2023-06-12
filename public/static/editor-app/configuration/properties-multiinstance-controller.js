/*
 * Execution listeners
 */

var KisBpmMultiInstanceCtrl = ['$scope', function ($scope) {

  if ($scope.property.value == undefined && $scope.property.value == null) {
    $scope.property.value = 'None';
  }

  $scope.multiInstanceChanged = function () {
    $scope.updatePropertyInModel($scope.property);
  };
}];
