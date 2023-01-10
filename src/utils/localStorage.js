import store from 'store'
const USER_KEY = 'user_key'
export default {
  // 保存 user
  setUser(user) {
    // localStorage.setItem(USER_KEY, JSON.stringify(user))
    store.set(USER_KEY, user)
  },

  getUser() {
    // return JSON.parse(localStorage.getItem(USER_KEY)) || {}
    console.log('@getUser@')
    return   store.get(USER_KEY) || {}
  },

  removeUser() {
    // localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
  }
}
