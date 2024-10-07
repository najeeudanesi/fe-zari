export function useDebounce<T extends (...args: unknown[]) => ReturnType<T>>(
  callback: T,
  delay: number
): T {
  let timeoutID: NodeJS.Timeout
  return function () {
    clearTimeout(timeoutID)
    let args = arguments
    let that = this
    timeoutID = setTimeout(function () {
      callback.apply(that, args)
    }, delay)
  } as T
}
