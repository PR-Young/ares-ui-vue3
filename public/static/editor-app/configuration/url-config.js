var KISBPM = KISBPM || {};

KISBPM.URL = {

  getModel: function (modelId) {
    return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/json';
  },

  getStencilSet: function () {
    return ACTIVITI.CONFIG.contextRoot + '/editor/stencilset?version=' + Date.now();
  },

  putModel: function (modelId) {
    return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/save';
  }
};
