import hasRole from './hasRole'
import hasPermi from './hasPermi'

const install = function (app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  //window.$vueApp.use(install) // eslint-disable-line
}

export default install
