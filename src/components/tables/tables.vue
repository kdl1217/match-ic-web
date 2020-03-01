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
import { getTableData } from '@/api/data'
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
          title: '设备号',
          key: 'deviceCode'
        },
        {
          title: '总里程',
          key: 'mileage'
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
    getTableData () {
      this.loading = true
      getTableData({
        pageNum: this.current,
        pageSize: this.size,
        deviceCode: this.deviceCode
      }).then(res => {
        this.loading = false
        this.lastdata = res.data.list
        this.total = res.data.totalData
      })
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
