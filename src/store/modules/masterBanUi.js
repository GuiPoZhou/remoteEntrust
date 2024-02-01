

const masterBanUi = {
    state:{
        listParamsList:[],//委托单动态表单
        bulletBox:[],//委托单弹框动态表单
        kevinLogWidget:null,//当前弹框的组件
        EntrustThis:null,
    },
    mutations:{
        set_listParamsList(state,list){
            state.listParamsList = list
        },
        set_bulletBox(state,list){
            state.bulletBox = list
        },
        set_kevinLogWidget(state,info){
            state.kevinLogWidget = info
        },
        set_entrustthis(state,e){
            state.EntrustThis = e
        }
    }
}
export default masterBanUi
