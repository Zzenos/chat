export const wheel = {
  inserted(el, binding) {
    // let timer = null
    const { value } = binding
    el.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) > 3) {
        // clearTimeout(timer)
        // timer = setTimeout(() => {
        //   const isNext = e.deltaX > 0
        //   value(isNext)
        // }, 100)
        const disabled = el.getAttribute('wheel-disabled')
        el.setAttribute('wheel-disable', false)
        if (disabled) return
        const isNext = e.deltaX > 0
        value(isNext)
      }
    })
  }
}

export default wheel
