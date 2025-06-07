import { supabase } from "./Supabase/SupabaseConfig";
import { MemeType } from "../utils/Types";
import { addPost } from "./Supabase/MemesServices";

// Subida de imágenes (solo imágenes)
export async function uploadImage(file: File): Promise<string | null> {
  try {
    console.log('Starting image upload...', { fileName: file.name, fileSize: file.size });

    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo es demasiado grande (máximo 5MB)');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) {
      throw new Error('No se pudo determinar la extensión del archivo');
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `memes/${fileName}`;

    console.log('Uploading to path:', filePath);

    const { error: uploadError } = await supabase.storage
      .from('memes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      throw new Error(`Error al subir la imagen: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('memes')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('No se pudo obtener la URL pública de la imagen');
    }

    console.log('Public URL obtained:', urlData.publicUrl);
    return urlData.publicUrl;

  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Subida completa del meme (imagen + post en base de datos)
export async function uploadMeme(file: File, userName: string): Promise<boolean> {
  try {
    console.log('Starting meme upload process...');

    if (!userName.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }

    const imageUrl = await uploadImage(file);

    if (!imageUrl) {
      throw new Error('No se pudo subir la imagen al storage');
    }

    const memeData: MemeType = {
      username: userName.trim(),
      image: imageUrl,
    };

    console.log('Saving meme data to database:', memeData);

    const postId = await addPost(memeData);

    if (!postId) {
      console.error('Failed to save post to database');
      // Limpiar imagen subida si falla el guardado en BD
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('memes').remove([`memes/${fileName}`]);
      }
      return false;
    }

    console.log('Meme uploaded successfully with ID:', postId);
    return true;

  } catch (error) {
    console.error('Error uploading meme:', error);
    return false;
  }
}

// Probar la conexión con Supabase
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('count(*)', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}