import {net} from '@/api/requestList.js'
const menu = {
  state:{
    menus: [],
    staticData: {},
  },
  mutations:{
    set_menu(state,menu){
      state.menus = menu
    },
    set_staticData(state,staticData){
      state.staticData = staticData
    }
  },
  actions:{
    getStaticData({commit}) {
      net('/v1/entrustRemoteAgreement/indexSchedule','get').then(res => {
        console.log(res,'统计')
        if (res.code === 200) {
          commit('set_staticData',res.data)
        }
      })
    }
  }

}
export default menu
