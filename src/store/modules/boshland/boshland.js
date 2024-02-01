const boshland = {
    state: {
        boContainerHeight: 0, //布局外层容器 动态高度
        boMainHeight: 0, //内容区域高度
        boMainNavHeight: 0, //内容区域 顶部操作区域高度
    },
    mutations: {
        set_boContainerHeight(state, height) {
            state.boContainerHeight = height
        },
        set_boMainHeight(state, height) {
            state.boMainHeight = height
        },
        set_boMainNavHeight(state, height) {
            state.boMainNavHeight = height
        }

    }
}

export default boshland