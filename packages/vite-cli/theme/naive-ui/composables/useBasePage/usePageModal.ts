import PageDialog from '@/components/page-dialog/index.vue'
type CallbackFn = () => void

export function usePageModal(
  createCallback: CallbackFn,
  editCallback: CallbackFn,
  editTitle: string,
  createTitle: string
): any {
  const pageModalRef = ref<InstanceType<typeof PageDialog>>()
  const defaultInfo = ref({})
  const title = ref<any>()
  // const title = ref<any>({
  //   editTitle: '',
  //   createTitle: ''
  // })
  const handleCreateClick = () => {
    title.value = createTitle
    defaultInfo.value = {}
    if (pageModalRef.value) {
      pageModalRef.value.dialogVisible = true
    }
    createCallback && createCallback()
  }
  const showDialog = (type: boolean) => {
    pageModalRef.value.dialogVisible = type
  }
  const handleEditClick = (item: any) => {
    defaultInfo.value = { ...item }
    title.value = editTitle
    if (pageModalRef.value) {
      pageModalRef.value.dialogVisible = true
    }
    editCallback && editCallback()
  }

  return {
    title,
    pageModalRef,
    handleCreateClick,
    handleEditClick,
    showDialog,
    defaultInfo
  }
}
