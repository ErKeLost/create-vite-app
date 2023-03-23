import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persistedstate'
const store = createPinia()
store.use(piniaPluginPersist)
export function setupStore(app: App<Element>) {
  return new Promise((resolve) => {
    app.use(store)
    resolve('store挂载完成')
  })
}
export * from './modules'
export { store }
