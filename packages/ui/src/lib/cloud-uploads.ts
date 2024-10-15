import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { createClient } from '@supabase/supabase-js'

export interface AWSConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  path: string;
}

export interface SupabaseConfig {
  url: string;
  key: string;
  bucketName: string;
  path: string;
}

export const uploadToAWS = async (
  file: File,
  config: AWSConfig,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: config.bucketName,
      Key: `${config.path}/${file.name}`,
      Body: file,
    },
  })

  upload.on('httpUploadProgress', (progress) => {
    if (onProgress && progress.loaded && progress.total) {
      onProgress((progress.loaded / progress.total) * 100)
    }
  })

  await upload.done()

  return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${config.path}/${file.name}`
}

export const uploadToSupabase = async (
  file: File, 
  config: SupabaseConfig,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const supabase = createClient(config.url, config.key)

  const { data, error } = await supabase.storage
    .from(config.bucketName)
    .upload(`${config.path}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('Upload failed')
  }

  const { data: publicUrlData } = supabase.storage
    .from(config.bucketName)
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}
