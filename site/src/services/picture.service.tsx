import { getAuthHeader } from './auth.service'

export const pickPicture = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = e => {
      const target = e.target as HTMLInputElement
      resolve(target.files[0])
    }
    input.onerror = reject
    input.click()
  })
}

export const uploadProfilePicture = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  let req: any = await fetch(`${process.env.REACT_APP_UPLOAD}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: getAuthHeader().token,
    }
  })
  req = await req.json()

  return `${process.env.REACT_APP_UPLOAD}/download/${req.originalname}`

}
