export function usePaginationHook() {
  const page = ref<{ currentPage: number; pageSize: number }>({
    currentPage: 1,
    pageSize: 10
  })
  const PagingParameters = computed(() => {
    return {
      start: (page.value.currentPage - 1) * page.value.pageSize,
      length: page.value.pageSize
    }
  })
  const totalCount = ref<number>(0)
  return {
    page,
    totalCount,
    PagingParameters
  }
}
