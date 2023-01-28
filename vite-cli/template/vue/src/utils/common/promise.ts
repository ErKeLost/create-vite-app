export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
export function promise(callback: any) {
  return new Promise((resolve) => {
    resolve(callback)
  })
}

export function promiseAllSettled(arr: any[]) {
  return Promise.allSettled(arr)
}
