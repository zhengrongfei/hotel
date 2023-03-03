/*
* 进行local数据存储管理的工具模块
* */

import store from "store";

const USER_KEY = "user_key"
export default {
  //保存
  saveAuth(JWT, role) {
    // localStorage.setItem(USER_KEY,JSON.stringify(user))
    store.set(USER_KEY, { JWT, role })
  },
  //读取
  getAuth() {
    // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    return store.get(USER_KEY) || ""
  },
  //删除
  deleteAuth() {
    // localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
  }
}

