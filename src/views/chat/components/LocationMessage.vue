<template>
  <div class="location-message">
    <div class="top">
      <div class="left">
        <img src="@/assets/icon_map.png" alt="" />
      </div>
      <div class="right">
        <div class="title">{{ title }}</div>
        <div class="desc">{{ des }}</div>
      </div>
    </div>
    <div class="map" ref="mapid"></div>
  </div>
</template>

<script type="text/javascript" id="AMapJS_id" src="https://webapi.amap.com/maps?v=1.4.15&key=f5a97e766c4aef8a86793374eb4f399f&plugin=AMap.Geocoder,AMap.Autocomplete,AMap.PlaceSearch" async></script>
<script>
import MapLoader from '@/util/AMapUtil'

export default {
  name: 'LocationMessage',
  props: {
    zoom: {
      type: Number,
      default: 10
    },
    title: {
      type: String,
      default: '圣熙8号购物中心'
    },
    des: {
      type: String,
      default: '北京市海淀区学清路甲8号'
    },
    latitude: {
      type: String,
      default: '40.008850098'
    },
    longitude: {
      type: String,
      default: '116.353965759'
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
      }
    }
  },
  computed: {
    center() {
      return [Number(this.longitude), Number(this.latitude)]
    }
  },
  methods: {
    async init() {
      const AMap = await MapLoader()
      this.mapInstance = new AMap.Map(this.$refs.mapid, {
        resizeEnable: false,
        doubleClickZoom: false,
        center: this.center,
        zoom: this.zoom
      })
      let lnglat = this.center
      this.setMarker({ lnglat })
      // this.setMarker({ lnglat: [116.397428, 39.90923] })
      // 点击地图，获取经纬度
      // this.mapInstance.on('click', e => {
      //   console.log(e.lnglat)
      //   let lnglat = [e.lnglat.lng, e.lnglat.lat]
      //   this.setMarker({ lnglat })
      // })
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
      this.mapInstance.setFitView(this.locationMarker) // 自动缩放地图到合适的视野级别
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.location-message {
  position: relative;
  width: 320px;
  height: 156px;
  background: #ffffff;
  border: 1px solid #e4e5e7;
  .top {
    display: flex;
    width: 320px;
    height: 68px;
    padding: 10px;
    box-sizing: border-box;
    text-align: left;
    .left {
      margin-right: 12px;
    }
    .right {
      .title {
        margin-bottom: 4px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        max-width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .desc {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        max-width: 235px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .map {
    width: 320px;
    height: 88px;
  }
}
</style>
