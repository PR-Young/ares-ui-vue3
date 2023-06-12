/*
 * String controller
 */

var KisBpmStringPropertyCtrl = ['$scope', function ($scope) {

    $scope.shapeId = $scope.selectedShape.id;
    $scope.valueFlushed = false;
    /** Handler called when input field is blurred */
    $scope.inputBlurred = function () {
        $scope.valueFlushed = true;
        if ($scope.property.value) {
            $scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig, "");
        }
        $scope.updatePropertyInModel($scope.property);
    };

    $scope.enterPressed = function (keyEvent) {
        if (keyEvent && keyEvent.which === 13) {
            keyEvent.preventDefault();
            $scope.inputBlurred(); // we want to do the same as if the user would blur the input field
        }
    };

    $scope.$on('$destroy', function controllerDestroyed() {
        if (!$scope.valueFlushed) {
            if ($scope.property.value) {
                $scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig, "");
            }
            $scope.updatePropertyInModel($scope.property, $scope.shapeId);
        }
    });

}];

/*
 * Boolean controller
 */

var KisBpmBooleanPropertyCtrl = ['$scope', function ($scope) {

    $scope.changeValue = function () {
        if ($scope.property.key === 'oryx-defaultflow' && $scope.property.value) {
            var selectedShape = $scope.selectedShape;
            if (selectedShape) {
                var incomingNodes = selectedShape.getIncomingShapes();
                if (incomingNodes && incomingNodes.length > 0) {
                    // get first node, since there can be only one for a sequence flow
                    var rootNode = incomingNodes[0];
                    var flows = rootNode.getOutgoingShapes();
                    if (flows && flows.length > 1) {
                        // in case there are more flows, check if another flow is already defined as default
                        for (var i = 0; i < flows.length; i++) {
                            if (flows[i].resourceId != selectedShape.resourceId) {
                                var defaultFlowProp = flows[i].properties['oryx-defaultflow'];
                                if (defaultFlowProp) {
                                    flows[i].setProperty('oryx-defaultflow', false, true);
                                }
                            }
                        }
                    }
                }
            }
        }
        $scope.updatePropertyInModel($scope.property);
    };

}];

/*
 * Text controller
 */

var KisBpmTextPropertyCtrl = ['$scope', '$modal', function ($scope, $modal) {

    var opts = {
        template: 'editor-app/configuration/properties/text-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmTextPropertyPopupCtrl = ['$scope', function ($scope) {

    $scope.save = function () {
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.close = function () {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}];
