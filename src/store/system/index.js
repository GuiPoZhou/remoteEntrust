const system = {
    state:{
        routerList:[],
        closeDrag:true,//是否开启表单拖拽
        disableProject:[''], //如果在该项目不显示一些按钮就放进去
        showProject: ['']// 指定项目所显示的按钮
    },
    mutations:{
        set_closeDrag:(state,b)=>{
            state.closeDrag = b
        },
        set_system_routerList:(state,list)=>{
            console.log('list',list)
            // localStorage.setItem('microActivitiRouterList',JSON.stringify(list))
            state.routerList = list
        }
    }


}

export default  system
