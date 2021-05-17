// 向下滚动加载
export const scrollLoad = {
  inserted(el, binding) {
    const { value } = binding
    const distance = Number(el.getAttribute('scroll-distance'))
    el.addEventListener('scroll', () => {
      const disabled = el.getAttribute('scroll-disabled')
      if (disabled) return
      const distanceBottom = el.scrollHeight - (el.scrollTop + el.clientHeight)
      if (distanceBottom < distance) {
        value()
      }
    })
  }
}

// 向上滚动加载
export const scrollTopLoad = {
  inserted(el, binding) {
    const { value } = binding
    el.addEventListener('scroll', () => {
      const disabled = el.getAttribute('scroll-disabled')
      if (disabled) return
      if (!el.scrollTop) {
        // 获取顶部加载前距离底部位置
        const distanceBottom = el.scrollHeight - (el.scrollTop + el.clientHeight)
        value(() => {
          // 加载数据返回原来位置
          const scrollTop = el.scrollHeight - distanceBottom - el.clientHeight
          el.scrollTop = scrollTop
        })
      }
    })
  }
}

export default scrollLoad
