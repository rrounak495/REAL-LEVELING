import { type Result, type AppError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

const toAppError = (e: any): AppError => ({
  name: e?.name || 'StorageError',
  message: e?.message || 'Storage Error',
  code: e?.code || 'STORAGE_ERROR',
});

export class StorageRepository {
  async uploadFeedImage(userId: string, uri: string): Promise<Result<string>> {
    try {
      const ext = uri.substring(uri.lastIndexOf('.') + 1);
      const fileName = `${userId}/${Date.now()}.${ext}`;

      // In React Native with supabase-js, passing the uri to fetch then getting blob is common
      const response = await fetch(uri);
      const blob = await response.blob();

      const { error } = await supabase.storage.from('feed_images').upload(fileName, blob, {
        contentType: `image/${ext}`,
        upsert: false,
      });

      if (error) return { success: false, error: toAppError(error) };

      const { data: publicData } = supabase.storage.from('feed_images').getPublicUrl(fileName);
      return { success: true, data: publicData.publicUrl };
    } catch (e: any) {
      return { success: false, error: toAppError(e) };
    }
  }

  async deleteFeedImage(imageUrl: string): Promise<Result<void>> {
    try {
      const path = imageUrl.split('feed_images/')[1];
      if (!path) return { success: false, error: toAppError(new Error('Invalid image URL')) };

      const { error } = await supabase.storage.from('feed_images').remove([path]);
      if (error) return { success: false, error: toAppError(error) };

      return { success: true, data: undefined };
    } catch (e: any) {
      return { success: false, error: toAppError(e) };
    }
  }
}
