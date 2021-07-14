<template>
  <div class="location-message" ref="mapid"></div>
</template>

<script type="text/javascript" id="AMapJS_id" src="https://webapi.amap.com/maps?v=1.4.15&key=f5a97e766c4aef8a86793374eb4f399f&plugin=AMap.Geocoder,AMap.Autocomplete,AMap.PlaceSearch" async></script>
<script>
import MapLoader from '@/util/AMapUtil'

export default {
  name: 'LocationMessage',
  props: {
    center: {
      type: Array,
      default: () => [116.397428, 39.90923]
    },
    zoom: {
      type: Number,
      default: 10
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      metting: {
        address: '',
        cityCode: '',
        geocoder: '',
        geocoderInfo: {
          lng: '',
          lat: ''
        },
        locationMarker: '',
        mapInstance: ''
        // center: [116.397428, 39.90923],
        // zoom: 10
      }
    }
  },
  methods: {
    async init() {
      const AMap = await MapLoader()
      this.mapInstance = new AMap.Map(this.$refs.mapid, {
        resizeEnable: true,
        doubleClickZoom: false,
        center: this.center,
        zoom: this.zoom
      })
      this.setMarker({ lnglat: [116.397428, 39.90923] })
      // 点击地图，获取经纬度
      this.mapInstance.on('click', e => {
        console.log(e.lnglat)
        let lnglat = [e.lnglat.lng, e.lnglat.lat]
        this.setMarker({ lnglat })
      })
    },
    setMarker(e) {
      console.log('marker info', e)
      // 创建marker
      if (!this.locationMarker) {
        this.locationMarker = new AMap.Marker({
          icon: new AMap.Icon({
            size: new AMap.Size(29, 37),
            image: 'https://rewind-static.zmeng123.com/wxminioprogram/dashi/locationIcon.png',
            imageSize: new AMap.Size(29, 37)
          })
        })
        this.mapInstance.add([this.locationMarker])
      }
      this.locationMarker.setPosition(e.lnglat) // 设置marker位置
      this.mapInstance.setZoomAndCenter(e.zoom || this.zoom, e.lnglat) // 移动地图中心点
      // this.mapInstance.setFitView(this.locationMarker) // 自动缩放地图到合适的视野级别
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.location-message {
  width: 240px;
  height: 150px;
}
</style>
