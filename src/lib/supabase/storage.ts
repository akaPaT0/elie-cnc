import { createClient } from './client';

/**
 * Converts any image file (PNG, JPG, BMP, HEIC) to a compressed, web-friendly WebP File
 */
export async function convertToWebP(file: File, maxWidth = 1200, quality = 0.85): Promise<File> {
  // SVG files don't need raster compression
  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new globalThis.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      // Scale down large images to max 1200px width while maintaining aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
          const webpFile = new File([blob], cleanName, { type: 'image/webp' });
          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Upload an image file to the 'product-images' bucket (auto-converts to WebP)
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error?: string }> {
  // Convert PNG/JPG to WebP before uploading
  const webpFile = await convertToWebP(file);
  const supabase = createClient();
  
  if (!supabase) {
    // Local fallback preview if Supabase is not connected
    const fakeUrl = URL.createObjectURL(webpFile);
    return { url: fakeUrl };
  }

  const fileExt = webpFile.name.split('.').pop() || 'webp';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, webpFile, {
      cacheControl: '31536000', // 1 year cache
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl };
}

/**
 * Upload a digital CAD/GCODE file (.STL, .GCODE, .STEP, .DXF) to the 'product-files' bucket
 */
export async function uploadProductFile(file: File): Promise<{ path: string | null; fileSize: string; fileType: string; error?: string }> {
  const supabase = createClient();

  const fileExt = (file.name.split('.').pop() || '').toUpperCase();
  const rawSizeMB = (file.size / (1024 * 1024)).toFixed(1);
  const fileSize = `${rawSizeMB} MB`;
  let fileType = 'STL';

  if (['GCODE', 'NC', 'TAP', 'NGC'].includes(fileExt)) fileType = 'GCODE';
  else if (['STEP', 'STP'].includes(fileExt)) fileType = 'STEP';
  else if (['DXF', 'DWG'].includes(fileExt)) fileType = 'DXF';

  if (!supabase) {
    return { path: `/files/${file.name}`, fileSize, fileType };
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}_${file.name}`;
  const filePath = `downloads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    return { path: null, fileSize, fileType, error: uploadError.message };
  }

  return { path: filePath, fileSize, fileType };
}
