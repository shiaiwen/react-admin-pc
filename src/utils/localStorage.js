import store from 'store'
const USER_KEY = 'user_key'
// 保存 user
function setUser(user) {
  // localStorage.setItem(USER_KEY, JSON.stringify(user))
  store.set(USER_KEY, user)
}

function getUser() {
  // return JSON.parse(localStorage.getItem(USER_KEY)) || {}
  console.log('@getUser@')
  return store.get(USER_KEY) || {}
}

function removeUser() {
  // localStorage.removeItem(USER_KEY)
  store.remove(USER_KEY)
}

const localStorage = {
  setUser,
  getUser,
  removeUser
}

export default localStorage
