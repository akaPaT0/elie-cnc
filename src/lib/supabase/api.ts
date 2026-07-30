import { createClient } from './client';
import { projects as mockProjects, products as mockProducts, categories as mockCategories, Project, Product, Category } from '@/data/mock';

// In-memory cache for fallback mutations during local testing without Supabase
let inMemoryProjects: Project[] = [...mockProjects];
let inMemoryProducts: Product[] = [...mockProducts];
let inMemoryCategories: Category[] = [...mockCategories];

/**
 * Fetch categories
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (!supabase) return inMemoryCategories;

  try {
    const { data, error } = await supabase.from('elie_categories').select('*');
    if (error || !data || data.length === 0) return inMemoryCategories;
    return data as Category[];
  } catch {
    return inMemoryCategories;
  }
}

/**
 * Fetch showcase projects
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  if (!supabase) return inMemoryProjects;

  try {
    const { data, error } = await supabase.from('elie_projects').select('*').order('date', { ascending: false });
    if (error || !data || data.length === 0) return inMemoryProjects;
    return data as Project[];
  } catch {
    return inMemoryProjects;
  }
}

/**
 * Fetch products (marketplace files)
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  if (!supabase) return inMemoryProducts;

  try {
    const { data, error } = await supabase.from('elie_products').select('*');
    if (error || !data || data.length === 0) return inMemoryProducts;

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
    return inMemoryProducts;
  }
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const allProducts = await getProducts();
  return allProducts.find((p) => p.id === id) || null;
}

// ========================================================
// MUTATION FUNCTIONS (ADMIN DASHBOARD)
// ========================================================

export async function createProduct(product: Omit<Product, 'id' | 'downloads'>): Promise<{ success: boolean; error?: string }> {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    downloads: 0,
  };

  const supabase = createClient();
  if (!supabase) {
    inMemoryProducts.unshift(newProduct);
    return { success: true };
  }

  const { error } = await supabase.from('elie_products').insert({
    id: newProduct.id,
    name: newProduct.name,
    description: newProduct.description,
    price: newProduct.price,
    file_type: newProduct.fileType,
    file_size: newProduct.fileSize,
    category: newProduct.category,
    image: newProduct.image,
    featured: newProduct.featured,
    compatibility: newProduct.compatibility,
    downloads: 0,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    inMemoryProducts = inMemoryProducts.map((p) => (p.id === id ? { ...p, ...updates } : p));
    return { success: true };
  }

  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.fileType !== undefined) dbUpdates.file_type = updates.fileType;
  if (updates.fileSize !== undefined) dbUpdates.file_size = updates.fileSize;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
  if (updates.compatibility !== undefined) dbUpdates.compatibility = updates.compatibility;

  const { error } = await supabase.from('elie_products').update(dbUpdates).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
    return { success: true };
  }

  const { error } = await supabase.from('elie_products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function createProject(project: Omit<Project, 'id'>): Promise<{ success: boolean; error?: string }> {
  const newProject: Project = {
    ...project,
    id: `proj-${Date.now()}`,
  };

  const supabase = createClient();
  if (!supabase) {
    inMemoryProjects.unshift(newProject);
    return { success: true };
  }

  const { error } = await supabase.from('elie_projects').insert(newProject);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    inMemoryProjects = inMemoryProjects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    return { success: true };
  }

  const { error } = await supabase.from('elie_projects').update(updates).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
    return { success: true };
  }

  const { error } = await supabase.from('elie_projects').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function createCategory(name: string, slug: string): Promise<{ success: boolean; error?: string }> {
  const newCat: Category = {
    id: `c-${Date.now()}`,
    name,
    slug,
    count: 0,
  };

  const supabase = createClient();
  if (!supabase) {
    inMemoryCategories.push(newCat);
    return { success: true };
  }

  const { error } = await supabase.from('elie_categories').insert(newCat);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    inMemoryCategories = inMemoryCategories.filter((c) => c.id !== id);
    return { success: true };
  }

  const { error } = await supabase.from('elie_categories').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
