import axios from '@/libs/api.request'

// 轨迹
export const getMapData = (data) => {
  return axios.request({
    url: '/api/position/query',
    method: 'get',
    params: data
  })
}

// 车辆分页
export const getTableData = (data) => {
  return axios.request({
    url: `/api/position/page`,
    method: 'get',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      deviceId: data.deviceId
    }
  })
}

// export const getTableData = () => {
//   return axios.request({
//     url: 'get_table_data',
//     method: 'get'
//   })
// }

// export const getDragList = () => {
//   return axios.request({
//     url: 'get_drag_list',
//     method: 'get'
//   })
// }

// export const errorReq = () => {
//   return axios.request({
//     url: 'error_url',
//     method: 'post'
//   })
// }

// export const saveErrorLogger = info => {
//   return axios.request({
//     url: 'save_error_logger',
//     data: info,
//     method: 'post'
//   })
// }

// export const uploadImg = formData => {
//   return axios.request({
//     url: 'image/upload',
//     data: formData
//   })
// }

// export const getOrgData = () => {
//   return axios.request({
//     url: 'get_org_data',
//     method: 'get'
//   })
// }

// export const getTreeSelectData = () => {
//   return axios.request({
//     url: 'get_tree_select_data',
//     method: 'get'
//   })
// }
