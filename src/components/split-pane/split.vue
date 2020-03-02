<!--
 * @Descripttion:
 * @Author: yulingjia
 * @Date: 2020-03-01 17:33:28
 * @LastEditTime: 2020-03-01 21:40:34
 -->
<template>
  <div class="page-container">
        <div class="toop_tips">
          <Form ref="formInline" :model="formInline" inline>
            <FormItem>
              <Input v-model="formInline.deviceCode" placeholder="设备型号"></Input>
            </FormItem>
              <FormItem>
                <DatePicker type="date" placeholder="开始时间" format="yyyy-MM-dd" v-model="formInline.startTime"></DatePicker>
              </FormItem>
              <FormItem>
                <DatePicker type="date" placeholder="结束时间" format="yyyy-MM-dd" v-model="formInline.endTime"></DatePicker>
              </FormItem>
              <FormItem>
              <Button type="primary" @click="getMapData()">搜索</Button>
            </FormItem>
          </Form>
        </div>
    <el-amap vid="amapDemo" :center="center" :amap-manager="amapManager" :zoom="zoom"
             style="width: 100%; height: 600px">
    </el-amap>
    <button @click="clear()">clear</button>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import VueAMap from 'vue-amap'
import CarUrl from '../../assets/images/car.png'
import * as moment from 'moment'

let amapManager = new VueAMap.AMapManager()
export default {
  data: function () {
    return {
      zoom: 12,
      center: [121.59996, 31.197646],
      amapManager: amapManager,
      nav: null,
      path: null,
      pathData: [],
      formInline: {
        deviceCode: '1',
        startTime: new Date(),
        endTime: new Date()
      }
    }
  },
  methods: {
    clear () {
      const me = this
      if (me.path != null) {
        me.path.setData([])
        me.nav.destroy()
      }
    },
    getMapData () {
      const me = this
      console.log(me.formInline)
      // var map = new AMap.Map('amap-container', {
      //   resizeEnable: true,
      //   zoom: 11
      //   // center: [116.397428, 39.90923]
      // })

      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$', 'lib/utils'], function (PathSimplifier, $, utils) {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }

        me.pathSimplifier = PathSimplifier

        let map = me.amapManager.getMap()

        let pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          // autoSetFitView:false,
          map: map, // 所属的地图实例
          // eslint-disable-next-line no-unused-vars
          getPath: function (pathData, pathIndex) {
            return pathData.path
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            if (pointIndex >= 0) {
              // point
              return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length
            }
            return pathData.name + '，点数量' + pathData.path.length
          },

          renderOptions: {
            pathLineStyle: {
              dirArrowStyle: true
            },
            getPathStyle: function (pathItem, zoom) {
              // eslint-disable-next-line one-var
              let color = colors[pathItem.pathIndex % colors.length],
                lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3))

              return {
                pathLineStyle: {
                  strokeStyle: color,
                  lineWidth: lineWidth
                },
                pathLineSelectedStyle: {
                  lineWidth: lineWidth + 2
                },
                pathNavigatorStyle: {
                  fillStyle: color
                }
              }
            }
          }
        })

        // window.pathSimplifierIns = pathSimplifierIns
        // just some colors
        let colors = [
          '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
          '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707',
          '#651067', '#329262', '#5574a6', '#3b3eac'
        ]

        let dataUrl = '/api/position/query'
        let param = {
          'deviceCode': me.formInline.deviceCode,
          'startTime': moment(me.formInline.startTime).format('YYYY-MM-DD HH:mm:ss'),
          'endTime': moment(me.formInline.endTime).format('YYYY-MM-DD HH:mm:ss')
        }

        me.$http.get(dataUrl, { params: param }).then(res => {
          let path = res.data
          let newPath
          newPath = path.map(item => {
            return [item.longitude, item.latitude]
          })
          me.pathData = newPath
          pathSimplifierIns.setData([{
            name: '路线0',
            path: newPath
          }])

          me.path = pathSimplifierIns

          // 创建巡航器
          var nav = pathSimplifierIns.createPathNavigator(0, {
            loop: true, // 循环播放
            speed: 4000, // 巡航速度，单位千米/小时
            pathNavigatorStyle: {
              width: 16,
              height: 32,
              // 使用图片
              content: PathSimplifier.Render.Canvas.getImageContent(CarUrl, onload, onerror),
              strokeStyle: null,
              fillStyle: null,
              // //经过路径的样式
              pathLinePassedStyle: {
                lineWidth: 6,
                strokeStyle: 'black',
                dirArrowStyle: {
                  stepSpace: 15,
                  strokeStyle: 'red'
                }
              }
            }
          })

          me.nav = nav
          nav.start()
        }).catch(err => {
          console.log(err)
        })
      })
    }
  }
}
</script>
