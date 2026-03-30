import { Cloudinary } from '@cloudinary/url-gen'

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqlzmrztl'
  }
})

export const CLOUDINARY_UPLOAD_PRESET = 
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'printaura_uploads'

export const CLOUDINARY_CLOUD_NAME = 
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqlzmrztl'

export async function uploadImageToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'posters')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  const data = await response.json()
  if (data.error) throw new Error(data.error.message)

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height
  }
}

export async function uploadVideoToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'videos')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  const data = await response.json()
  if (data.error) throw new Error(data.error.message)

  return {
    url: data.secure_url,
    publicId: data.public_id
  }
}