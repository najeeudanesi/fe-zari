export type FormFile = { file?: File; fileUrl: string }

export const validateInput = (e: InputEvent): string | undefined => {
  const input = e.target as HTMLInputElement
  return input.validity.valid
    ? undefined
    : input.title || input.validationMessage
}

export const toFormData = (object: Record<string, any>) => {
  const data = new FormData()
  for (const key in object) {
    if (!object[key]) continue
    data.append(key, object[key])
  }
  return data
}
