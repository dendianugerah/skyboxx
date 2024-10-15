import { useState } from 'react';
import { uploadToAWS, uploadToSupabase, AWSConfig, SupabaseConfig } from '../lib/cloud-uploads';

export type CloudProvider = 'supabase' | 'aws' | 'gcs' | 'azure' | 'digitalocean' | 'backblaze' | 'dropbox' | 'cloudflare';

export interface Config {
  supabase?: SupabaseConfig;
  aws?: AWSConfig;
  
}

export const useCloudUpload = (provider: CloudProvider, config: Config) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloud = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      let uploadUrl: string;

      switch (provider) {
        case 'supabase':
          if (!config.supabase) throw new Error('Supabase configuration is missing');
          uploadUrl = await uploadToSupabase(file, config.supabase, onProgress);
          break;
        case 'aws':
          if (!config.aws) throw new Error('AWS configuration is missing');
          uploadUrl = await uploadToAWS(file, config.aws, onProgress);
          break;
        default:
          throw new Error(`Unsupported cloud provider: ${provider}`);
      }

      return uploadUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToCloud, isUploading, error };
};
