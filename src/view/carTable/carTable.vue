<template>
  <div style="margin:0 auto;">
    <Table :loading="loading" border :columns="columns" :data="lastdata"></Table>
    <br />
    <div align="center">
      <template>
        <Page
          :total="total"
          :current="current"
          :page-size="size"
          @on-change="getTableData"
          show-total
        />
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      current: 1,
      size: 10,
      total: 0,
      deviceCode: '',
      lastdata: [],
      columns: [

        {
          title: 'id',
          key: 'id'
        },
        {
          title: '设备号',
          key: 'deviceId'
        },
        {
          title: '距离',
          key: 'distance'
        },
        {
          title: '速度',
          key: 'speed'
        },
        {
          title: '经度',
          key: 'longitude'
        },
        {
          title: '纬度',
          key: 'latitude'
        },
        {
          title: '上报时间',
          key: 'collectTime'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                },
                'View'
              )
            ])
          }
        }
      ]
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData (val) {
      this.current = val || 1
      this.loading = true
      let dataUrl = '/api/position/page'
      let param = {
        pageNum1: this.current,
        pageSize1: this.size,
        deviceCode1: this.deviceCode
      }
      this.$http.get(dataUrl, { params: param }).then(res => {
        this.loading = false
        this.lastdata = res.data.data.list
        this.total = res.data.data.total
      })
      // getTableData({
      //   pageNum1: this.current,
      //   pageSize1: this.size,
      //   deviceCode1: this.deviceCode
      // }).then(res => {
      //   this.loading = false
      //   this.lastdata = res.data.data.list
      //   this.total = res.data.data.total
      // })
    }
  }
}
</script>
<style>
  .pro-page {
    position: fixed;
    height: 500px;
  }
</style>
