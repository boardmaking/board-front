function getImageTagArrayFrom(values) {
  return values.match(/<img[^>]*>/g)
}

function getBase64DataArrayFrom(values) {
  const base64DataArray = values.match(
      /data:image\/([a-zA-Z]*);base64,([A-Za-z0-9+\/=]+)/)
  const dataUrl = base64DataArray?.[0]
  const imageType = base64DataArray?.[1]
  const base64Data = base64DataArray?.[2]
  return {dataUrl, imageType, base64Data}
}

export {getImageTagArrayFrom, getBase64DataArrayFrom,}