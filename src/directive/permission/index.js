import hasRole from './hasRole'
import hasPermi from './hasPermi'

const install = function (Vue) {
  window.$vueApp.directive('hasRole', hasRole)
  window.$vueApp.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window.$vueApp.use(install) // eslint-disable-line
}

export default install
