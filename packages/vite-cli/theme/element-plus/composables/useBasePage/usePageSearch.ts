import PageTable from '@/components/pageTable/index.vue'
export function usePageSearch() {
  const pageTableRef = ref<InstanceType<typeof PageTable>>()
  const handleResetClick = () => {
    pageTableRef.value?.getTableData({}, true)
  }
  const handleQueryClick = (queryInfo: any) => {
    pageTableRef.value?.getTableData(queryInfo, true)
  }
  return { pageTableRef, handleResetClick, handleQueryClick }
}
