// export default {
//   provider: localStorage,
//   serialize: JSON.stringify,
//   deserialize: JSON.parse,
//   get(key) {
//     let val
//     try {
//       const { value, expires } = this.deserialize(this.provider.getItem(key))
//       if (expires === 0 || expires > Date.now()) {
//         val = this.deserialize(value)
//       } else {
//         val = null
//       }
//     } catch (e) {
//       process.env.NODE_ENV === 'development' && console.log(`localStorage获取${key}失败`, e)
//     }
//     return val
//   },
//   set(key, value, expires = 0) {
//     try {
//       this.provider.setItem(key, this.serialize({
//         expires,
//         value: this.serialize(value)
//       }))
//     } catch (e) {
//       process.env.NODE_ENV === 'development' && console.log(`localStorage设置${key}失败`, e)
//     }
//   },
//   remove(keys) {
//     keys.forEach((key) => {
//       this.provider.removeItem(key)
//     })
//   }
// }

export const getTokenValue = data => {
  let val
  const { value, expires } = data
  if (expires === 0 || expires > Date.now()) {
    val = value
  } else {
    val = null
  }
  return val
}
export default {}
