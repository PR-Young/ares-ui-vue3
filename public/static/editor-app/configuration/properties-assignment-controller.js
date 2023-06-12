/*
 * Assignment
 */
var KisBpmAssignmentCtrl = ['$scope', '$modal', function ($scope, $modal) {

  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
    scope: $scope
  };

  // Open the dialog
  $modal(opts);
}];

var KisBpmAssignmentPopupCtrl = ['$scope', function ($scope) {

  // Put json representing assignment on scope
  if ($scope.property.value !== undefined && $scope.property.value !== null
    && $scope.property.value.assignment !== undefined
    && $scope.property.value.assignment !== null) {
    $scope.assignment = $scope.property.value.assignment;
  } else {
    $scope.assignment = {};
  }

  if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0) {
    $scope.assignment.candidateUsers = [{value: ''}];
  }

  // Click handler for + button after enum value
  var userValueIndex = 1;
  $scope.addCandidateUserValue = function (index) {
    $scope.assignment.candidateUsers.splice(index + 1, 0, {value: 'value ' + userValueIndex++});
  };

  // Click handler for - button after enum value
  $scope.removeCandidateUserValue = function (index) {
    $scope.assignment.candidateUsers.splice(index, 1);
  };

  if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0) {
    $scope.assignment.candidateGroups = [{value: ''}];
  }

  var groupValueIndex = 1;
  $scope.addCandidateGroupValue = function (index) {
    $scope.assignment.candidateGroups.splice(index + 1, 0, {value: 'value ' + groupValueIndex++});
  };

  // Click handler for - button after enum value
  $scope.removeCandidateGroupValue = function (index) {
    $scope.assignment.candidateGroups.splice(index, 1);
  };

  $scope.save = function () {

    $scope.property.value = {};
    handleAssignmentInput($scope);
    $scope.property.value.assignment = $scope.assignment;

    $scope.updatePropertyInModel($scope.property);
    $scope.close();
  };

  // Close button handler
  $scope.close = function () {
    handleAssignmentInput($scope);
    $scope.property.mode = 'read';
    $scope.$hide();
  };

  var handleAssignmentInput = function ($scope) {
    if ($scope.assignment.candidateUsers) {
      var emptyUsers = true;
      var toRemoveIndexes = [];
      for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
        if ($scope.assignment.candidateUsers[i].value != '') {
          emptyUsers = false;
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i;
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1);
      }

      if (emptyUsers) {
        $scope.assignment.candidateUsers = undefined;
      }
    }

    if ($scope.assignment.candidateGroups) {
      var emptyGroups = true;
      var toRemoveIndexes = [];
      for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
        if ($scope.assignment.candidateGroups[i].value != '') {
          emptyGroups = false;
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i;
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1);
      }

      if (emptyGroups) {
        $scope.assignment.candidateGroups = undefined;
      }
    }
  };
}];
