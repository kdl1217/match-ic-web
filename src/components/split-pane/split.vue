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
          <Button type="primary" @click="handleSearch">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div id="amap-container"></div>
  </div>
</template>

<script>
import { getMapData } from '@/api/data'
export default {
  data () {
    return {
      formInline: {
        deviceCode: '1',
        startTime: new Date(),
        endTime: new Date()
      }
    }
  },
  mounted () {
    this.getData()
    // this.getMap()
  },
  methods: {
    getMap () {
      var map = new AMap.Map('amap-container', {
        resizeEnable: true,
        zoom: 11
        // center: [116.397428, 39.90923]
      })

      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$', 'lib/utils'], function (
        PathSimplifier,
        $,
        utils
      ) {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }
        var pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map,
          getPath: function (pathData, pathIndex) {
            var points = pathData.points
            var lnglatList = []
            for (var i = 0, len = points.length; i < len; i++) {
              lnglatList.push(points[i].lnglat)
            }
            return lnglatList
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            if (pointIndex >= 0) {
              return (
                pathData.name +
                '，点：' +
                pointIndex +
                '/' +
                pathData.path.length
              )
            }
            return pathData.name + '，点数量' + pathData.path.length
          },
          renderOptions: {
            renderAllPointsIfNumberBelow: 100
          }
        })

        window.pathSimplifierIns = pathSimplifierIns

        pathSimplifierIns.setData([{
          name: '路线0',
          points: [{
            name: '点a',
            lnglat: [116.405289, 39.904987]
          }, {
            name: '点l',
            lnglat: [87.61792, 43.793308]
          }]
        }])

        pathSimplifierIns.setSelectedPathIndex(0)
        pathSimplifierIns.on('pointClick', function (e, info) {
          console.log('Click: ' + info.pathData.points[info.pointIndex].name)
        })
      })
    },
    getData () {
      getMapData({
        deviceCode: this.formInline.deviceCode,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime
      }).then(res => {
        this.tableData = res.data
        this.getMap()
      })
    },
    handleSearch () {
      console.log(this.formInline)
      // this.getData()
    }
  }
}
</script>

<style scoped>
.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#amap-container {
  width: 100%;
  flex: 1;
  margin-bottom: 20px;
}
</style>
