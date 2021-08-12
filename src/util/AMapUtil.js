const waitAMapExpList = [] // 解决同一页面 不同组件各自引入MapLoader，callback只执行一次引起的bug
export default function MapLoader() {
  const AMapJS_id = document.getElementById('AMapJS_id')
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else if (!window.AMap && AMapJS_id) {
      waitAMapExpList.push({
        resolve,
        reject
      })
    } else {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.id = 'AMapJS_id'
      script.async = true
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=f5a97e766c4aef8a86793374eb4f399f'
      script.onerror = reject
      document.head.appendChild(script)
      window.initAMap = () => {
        resolve(window.AMap)
        if (waitAMapExpList.length !== 0) {
          waitAMapExpList.forEach(item => {
            item.resolve(window.AMap)
          })
        }
      }
    }
  })
}
