export const useCounterStore = defineStore(
  'counter-store',
  () => {
    const counter = $ref<number>(0)
    function increment() {
      counter++
    }
    return {}
  },
  {
    persist: {
      enabled: true
    }
  }
)
