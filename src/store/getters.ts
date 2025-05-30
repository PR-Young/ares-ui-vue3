const getters = {
  sidebar: (state: { app: { sidebar: any } }) => state.app.sidebar,
  size: (state: { app: { size: any } }) => state.app.size,
  device: (state: { app: { device: any } }) => state.app.device,
  visitedViews: (state: { tagsView: { visitedViews: any } }) =>
    state.tagsView.visitedViews,
  cachedViews: (state: { tagsView: { cachedViews: any } }) =>
    state.tagsView.cachedViews,
  token: (state: { user: { token: any } }) => state.user.token,
  avatar: (state: { user: { avatar: any } }) => state.user.avatar,
  name: (state: { user: { name: any } }) => state.user.name,
  userAccount: (state: { user: { account: any } }) => state.user.account,
  introduction: (state: { user: { introduction: any } }) =>
    state.user.introduction,
  roles: (state: { user: { roles: any } }) => state.user.roles,
  permissions: (state: { user: { permissions: any } }) =>
    state.user.permissions,
  permission_routes: (state: { permission: { routes: any } }) =>
    state.permission.routes,
  notice_num: (state: { user: { notice: any } }) => state.user.notice,
};
export default getters;
