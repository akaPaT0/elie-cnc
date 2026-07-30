-- ========================================================
-- Elie CNC — Supabase Database Schema & Seed Data
-- Prefixed with 'elie_' to isolate from other project tables
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. Categories Table (elie_categories)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.elie_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------
-- 2. Projects Table (elie_projects - CNC Work Showcase)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.elie_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    date DATE NOT NULL,
    material TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------
-- 3. Products Table (elie_products - GCode & STL Files Marketplace)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.elie_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('STL', 'GCODE', 'STEP', 'DXF')),
    file_size TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    compatibility TEXT[] DEFAULT '{}',
    downloads INTEGER DEFAULT 0,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------
-- 4. Enable Row Level Security (RLS)
-- --------------------------------------------------------
ALTER TABLE public.elie_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elie_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elie_products ENABLE ROW LEVEL SECURITY;

-- Create Policies for Anonymous Public Read Access
CREATE POLICY "Allow public read access to elie_categories" 
    ON public.elie_categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access to elie_projects" 
    ON public.elie_projects FOR SELECT USING (true);

CREATE POLICY "Allow public read access to elie_products" 
    ON public.elie_products FOR SELECT USING (true);

-- --------------------------------------------------------
-- 5. Indexes for Performance
-- --------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_elie_projects_category ON public.elie_projects(category);
CREATE INDEX IF NOT EXISTS idx_elie_products_category ON public.elie_products(category);
CREATE INDEX IF NOT EXISTS idx_elie_products_file_type ON public.elie_products(file_type);
CREATE INDEX IF NOT EXISTS idx_elie_products_featured ON public.elie_products(featured);

-- --------------------------------------------------------
-- 6. Seed Data (Initial Workshop Content)
-- --------------------------------------------------------

-- Categories Seed Data
INSERT INTO public.elie_categories (id, name, slug, count) VALUES
('c1', 'Mechanical Parts', 'mechanical-parts', 12),
('c2', 'Decorative', 'decorative', 8),
('c3', 'Signs & Lettering', 'signs-lettering', 15),
('c4', 'Enclosures', 'enclosures', 5),
('c5', 'Jigs & Fixtures', 'jigs-fixtures', 9),
('c6', 'Artistic', 'artistic', 7)
ON CONFLICT (id) DO NOTHING;

-- Projects Seed Data
INSERT INTO public.elie_projects (id, title, description, images, category, date, material, dimensions) VALUES
('proj-1', 'Custom Aluminum Motor Bracket', 'Precision-milled motor mounting bracket for a high-torque NEMA 23 stepper. Machined from a single block of 6061-T6 aluminum to ensure zero flex under heavy load.', ARRAY['/images/placeholder.jpg'], 'Mechanical Parts', '2023-11-15', '6061-T6 Aluminum', '120 x 85 x 25 mm'),
('proj-2', 'Walnut Topographic Map', 'A 3D topographical map of Yosemite Valley carved into solid black walnut. We used a 1/8" tapered ball nose bit for the finishing pass.', ARRAY['/images/placeholder.jpg'], 'Artistic', '2023-10-22', 'Black Walnut', '600 x 400 x 45 mm'),
('proj-3', 'Backlit Brass Signage', 'Bespoke corporate signage cut from 1/4" brass plate. The letters are reverse-channeled to allow for LED diffusion.', ARRAY['/images/placeholder.jpg'], 'Signs & Lettering', '2023-12-05', 'C360 Brass & Acrylic', '800 x 250 x 6 mm'),
('proj-4', 'Modular Workbench Fixturing Plate', 'A custom fixture plate with a 50mm grid of M6 threaded holes and 8mm dowel pin holes. Surfaced flat to within 0.02mm.', ARRAY['/images/placeholder.jpg'], 'Jigs & Fixtures', '2024-01-10', 'Mic 6 Cast Aluminum Tooling Plate', '500 x 500 x 20 mm'),
('proj-5', 'Minimalist Keyboard Case', 'A two-part gasket-mounted mechanical keyboard enclosure. The bottom weight is machined from solid copper.', ARRAY['/images/placeholder.jpg'], 'Enclosures', '2024-02-18', 'Aluminum & Copper', '320 x 115 x 30 mm'),
('proj-6', 'Intricate Geometric Wall Panel', 'Parametrically designed wall panel featuring an aperiodic tiling pattern. V-carved into premium birch plywood.', ARRAY['/images/placeholder.jpg'], 'Decorative', '2023-09-30', 'Baltic Birch Plywood', '1200 x 1200 x 18 mm'),
('proj-7', 'Heavy Duty Router Mount', 'A split-clamp style spindle mount designed for an 80mm water-cooled spindle. Beefy design to eliminate chatter.', ARRAY['/images/placeholder.jpg'], 'Mechanical Parts', '2024-03-05', '7075 Aluminum', '140 x 95 x 80 mm'),
('proj-8', 'Oak Catch-All Tray', 'An elegant everyday carry tray with sweeping internal fillets that make it easy to scoop out coins or keys.', ARRAY['/images/placeholder.jpg'], 'Decorative', '2024-04-12', 'White Oak', '250 x 150 x 25 mm')
ON CONFLICT (id) DO NOTHING;

-- Products Seed Data
INSERT INTO public.elie_products (id, name, description, price, file_type, file_size, category, image, featured, compatibility, downloads) VALUES
('prod-1', 'Universal NEMA 23 Motor Mount', 'Production-ready files for a rigid NEMA 23 stepper motor mount. Includes slotted mounting holes for belt tensioning.', 15.00, 'STEP', '1.2 MB', 'Mechanical Parts', '/images/placeholder.jpg', true, ARRAY['Fusion 360', 'SolidWorks', 'FreeCAD'], 342),
('prod-2', 'Parametric Topo Map - Mount Rainier', 'High-resolution STL file for 3D relief carving of Mount Rainier. Scaled and pre-smoothed for 1/16" or 1/8" ball nose endmills.', 25.00, 'STL', '85 MB', 'Artistic', '/images/placeholder.jpg', true, ARRAY['VCarve Pro', 'Carveco', 'MeshCAM'], 128),
('prod-3', 'Standard Hold-Down Clamp Set', 'Robust, low-profile hold-down clamps perfect for making out of hardwood or aluminum scrap.', 8.50, 'DXF', '450 KB', 'Jigs & Fixtures', '/images/placeholder.jpg', false, ARRAY['AutoCAD', 'Fusion 360', 'VCarve'], 890),
('prod-4', 'Geometric Hex Wall Art', 'Modular hexagonal wall art pattern designed for V-carving with infinite tiling support.', 12.00, 'DXF', '2.1 MB', 'Decorative', '/images/placeholder.jpg', false, ARRAY['VCarve', 'Easel', 'Carbide Create'], 215),
('prod-5', 'Raspberry Pi 4 Machined Case', 'Complete CAD for a two-part passive cooling aluminum case for the Raspberry Pi 4.', 35.00, 'STEP', '4.5 MB', 'Enclosures', '/images/placeholder.jpg', true, ARRAY['Fusion 360', 'Inventor', 'SolidWorks'], 67),
('prod-6', 'Dust Shoe for 65mm Spindle', 'Magnetic, split-design dust shoe for 65mm spindles (Makita/Katsu). Allows easy tool changes.', 18.00, 'STL', '3.8 MB', 'Mechanical Parts', '/images/placeholder.jpg', false, ARRAY['3D Printers', 'MeshCAM'], 412),
('prod-7', 'Mid-Century Modern Plant Stand', 'Vectors for a flat-pack, interlocking plant stand designed for 3/4" (18mm) plywood.', 10.00, 'DXF', '800 KB', 'Decorative', '/images/placeholder.jpg', false, ARRAY['VCarve', 'Fusion 360', 'AutoCAD'], 305),
('prod-8', 'Customizable Sign Blank Templates', 'Collection of 15 classic sign blank shapes (shields, ribbons, ovals) with proper offsetting for clean carving.', 15.00, 'DXF', '1.5 MB', 'Signs & Lettering', '/images/placeholder.jpg', false, ARRAY['All 2D Vector Software'], 540),
('prod-9', 'Tramming Tool Hub', 'Machinable hub for building a precision spindle tramming tool with two dial indicators.', 22.00, 'STEP', '1.1 MB', 'Jigs & Fixtures', '/images/placeholder.jpg', true, ARRAY['Fusion 360', 'SolidWorks', 'FreeCAD'], 188),
('prod-10', 'Pre-Calculated Speeds & Feeds Chart (GCODE Gen)', 'Specialized macro script for generating optimal GCODE facing operations for spoilboards.', 5.00, 'GCODE', '50 KB', 'Jigs & Fixtures', '/images/placeholder.jpg', false, ARRAY['GRBL', 'Mach3', 'LinuxCNC'], 1024)
ON CONFLICT (id) DO NOTHING;
