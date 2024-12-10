import CryptoJS from 'crypto-js';


const encryptUtil = ({search, category}) => {

  const data = {search, category}
  const secretKey = "secretKey"

  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data),
      secretKey).toString();

  const encodedEncryptedData = encodeURIComponent(encryptedData);

  return {
    encodedEncryptedData
  }
}

export default encryptUtil;