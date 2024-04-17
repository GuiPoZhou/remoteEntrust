import {ComponentCustomProperties} from 'vue'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $BASE_API: string
    }
}
