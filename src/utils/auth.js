// 操作本地存储中的用户信息（包括token）
const USER_KEY = 'user'
export const getUser = () => JSON.parse(window.localStorage.getItem(USER_KEY))

export const setUser = () => window.localStorage.setItem(USER_KEY, JSON.stringify(USER_KEY))

export const removeUser = () => window.localStorage.removeItem(USER_KEY)
