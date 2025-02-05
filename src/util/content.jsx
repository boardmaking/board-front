import {getBase64DataArrayFrom, getImageTagArrayFrom} from "./imageUtil.js";
import {base64ToBlob, makeFilenameBy} from "./fileUtil.js";
import {SERVER_HOST} from "../constants/index.js";

function makeContentFrom(uploadImageMutationFn,value) {

  let newContent = value

  const imageTagArray = getImageTagArrayFrom(newContent)

  if (imageTagArray) {
    imageTagArray.map((imageTag) => {
      const formData = new FormData();
      const {dataUrl, imageType, base64Data} = getBase64DataArrayFrom(imageTag)
      if (dataUrl === undefined || imageType === undefined || base64Data === undefined) {return}
      const blob = base64ToBlob(base64Data, imageType)
      const filename = makeFilenameBy(imageType);

      formData.append('image', blob, filename)
      uploadImageMutationFn.mutate(formData)
      newContent = newContent.replace(dataUrl, `${SERVER_HOST}:28080/boards/files/${filename}?fileType=IMAGE" alt="${filename}`);
    })
  }
  return {newContent};

}

export default makeContentFrom;