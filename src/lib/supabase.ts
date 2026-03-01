import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize database client
const supabaseUrl = 'https://phurqaubfdehwrpfaetn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjljNGE3MTQwLTFkNWEtNGNmZC1hNjA3LWZjOTQwZmI3N2RiMCJ9.eyJwcm9qZWN0SWQiOiJwaHVycWF1YmZkZWh3cnBmYWV0biIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5OTUwOTMxLCJleHAiOjIwODUzMTA5MzEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.efL3-eK8AmySahEJWNUVZFEi8aOfsODuRKqwI90NBXQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
} as const;

// Helper function to upload file to storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ data: { path: string } | null; error: Error | null }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  return { data, error };
}

// Helper function to get public URL
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Helper function to delete file
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}

export default supabase;
