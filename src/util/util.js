export const Base64 = {
  stringify(str) {
    return window.btoa(encodeURIComponent(str))
  },
  parse(str) {
    return decodeURIComponent(window.atob(str))
  }
}