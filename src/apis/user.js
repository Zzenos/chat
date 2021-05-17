import axios from '@/util/request'
import store from '@/store'

export const login = user =>
  axios.request({
    url: '/authx/signin',
    method: 'POST',
    data: user
  })
export const logout = () =>
  axios.request({
    url: '/authx/revoke'
  })
// Token刷新
export const refreshToken = () =>
  axios.request({
    url: '/authx/refresh',
    method: 'GET',
    headers: {
      Authorization: `bearer ${store.getters.getRefreshToken()}`
    }
  })

// 获取权限信息
export const getPermissionInfo = id =>
  axios.request({
    url: `/acl/user/${id}/perms`
  })

// 所有菜单移动值 @/components/treeMenu.vue 的mounted, 修改后在控制台复制打印的值，请求接口/ui/perms 完成菜单修改

export default {}
