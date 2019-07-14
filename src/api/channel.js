/**
 * 频道相关接口封装模块
 */

import request from '@/utils/request'
/**
 * 获取用户频道列表
 * 如果没有登陆则返回默认推荐的频道列表
 * 如果登陆了 则返回用户频道列表
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

/**
 * 重置用户频道列表
 */
export const reseUserChannels = channels => {
  return request({
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

/**
 * 获取所有频道列表
 */

export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

/**
 * 删除指定用户频道
 */

export const deleteUserChannels = channelsId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelsId}`
  })
}

/**
 * 批量修改用户频道列表（部分覆盖）
 */

export const updateUserChannels = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
