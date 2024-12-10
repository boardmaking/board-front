export const base64ToBlob = (base64Data, mimeType = null) => {
  if (!mimeType) {
    const mimeTypeMatch = base64Data.match(/^data:([^;]+);base64,/);
    mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
    base64Data = base64Data.replace(/^data:([^;]+);base64,/, '');
  }

  const byteString = atob(base64Data);  // Base64 디코딩
  const length = byteString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
};
