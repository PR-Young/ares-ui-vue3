import hasRole from './hasRole'
import hasPermi from './hasPermi'

const install = function (app: any) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
}

export default install
