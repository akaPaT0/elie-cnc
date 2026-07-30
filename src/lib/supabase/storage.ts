import { createClient } from './client';

/**
 * Upload an image file (PNG, JPG, WEBP, SVG) to the 'product-images' bucket
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error?: string }> {
  const supabase = createClient();
  
  if (!supabase) {
    // Local fallback preview if Supabase is not connected
    const fakeUrl = URL.createObjectURL(file);
    return { url: fakeUrl };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
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
