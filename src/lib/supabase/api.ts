import { createClient } from './client';
import { projects as mockProjects, products as mockProducts, categories as mockCategories, Project, Product, Category } from '@/data/mock';

/**
 * Fetch all categories from Supabase with fallback to mock data
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (!supabase) return mockCategories;

  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data || data.length === 0) return mockCategories;
    return data as Category[];
  } catch {
    return mockCategories;
  }
}

/**
 * Fetch all showcase projects from Supabase with fallback to mock data
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  if (!supabase) return mockProjects;

  try {
    const { data, error } = await supabase.from('projects').select('*').order('date', { ascending: false });
    if (error || !data || data.length === 0) return mockProjects;
    return data as Project[];
  } catch {
    return mockProjects;
  }
}

/**
 * Fetch all products (files) from Supabase with fallback to mock data
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  if (!supabase) return mockProducts;

  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) return mockProducts;

    // Format DB snake_case columns if necessary to match Product interface
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      fileType: item.file_type || item.fileType,
      fileSize: item.file_size || item.fileSize,
      category: item.category,
      image: item.image,
      featured: Boolean(item.featured),
      compatibility: item.compatibility || [],
      downloads: Number(item.downloads || 0),
    })) as Product[];
  } catch {
    return mockProducts;
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const allProducts = await getProducts();
  return allProducts.find((p) => p.id === id) || null;
}
