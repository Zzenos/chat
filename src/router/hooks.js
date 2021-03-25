//
export default (to, from, next) => {
  console.log(to, from, next)
  // if (to.path === '')
  next()
}
