export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  date: string;
  material: string;
  dimensions: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  fileType: 'STL' | 'GCODE' | 'STEP' | 'DXF';
  fileSize: string;
  category: string;
  image: string;
  featured: boolean;
  compatibility: string[];
  downloads: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const categories: Category[] = [
  { id: 'c1', name: 'Mechanical Parts', slug: 'mechanical-parts', count: 12 },
  { id: 'c2', name: 'Decorative', slug: 'decorative', count: 8 },
  { id: 'c3', name: 'Signs & Lettering', slug: 'signs-lettering', count: 15 },
  { id: 'c4', name: 'Enclosures', slug: 'enclosures', count: 5 },
  { id: 'c5', name: 'Jigs & Fixtures', slug: 'jigs-fixtures', count: 9 },
  { id: 'c6', name: 'Artistic', slug: 'artistic', count: 7 },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'Custom Aluminum Motor Bracket',
    description: 'Precision-milled motor mounting bracket for a high-torque NEMA 23 stepper. Machined from a single block of 6061-T6 aluminum to ensure zero flex under heavy load. The pocketing reduces weight while maintaining structural integrity.',
    images: ['/images/placeholder.jpg'],
    category: 'Mechanical Parts',
    date: '2023-11-15',
    material: '6061-T6 Aluminum',
    dimensions: '120 x 85 x 25 mm'
  },
  {
    id: 'proj-2',
    title: 'Walnut Topographic Map',
    description: 'A 3D topographical map of Yosemite Valley carved into solid black walnut. We used a 1/8" tapered ball nose bit for the finishing pass, running for 14 hours to achieve this level of detail. Finished with Rubio Monocoat.',
    images: ['/images/placeholder.jpg'],
    category: 'Artistic',
    date: '2023-10-22',
    material: 'Black Walnut',
    dimensions: '600 x 400 x 45 mm'
  },
  {
    id: 'proj-3',
    title: 'Backlit Brass Signage',
    description: 'Bespoke corporate signage cut from 1/4" brass plate. The letters are reverse-channeled to allow for LED diffusion. Tolerances were kept tight to ensure a perfect press-fit for the acrylic diffusers.',
    images: ['/images/placeholder.jpg'],
    category: 'Signs & Lettering',
    date: '2023-12-05',
    material: 'C360 Brass & Acrylic',
    dimensions: '800 x 250 x 6 mm'
  },
  {
    id: 'proj-4',
    title: 'Modular Workbench Fixturing Plate',
    description: 'A custom fixture plate with a 50mm grid of M6 threaded holes and 8mm dowel pin holes. Surfaced flat to within 0.02mm across the entire span.',
    images: ['/images/placeholder.jpg'],
    category: 'Jigs & Fixtures',
    date: '2024-01-10',
    material: 'Mic 6 Cast Aluminum Tooling Plate',
    dimensions: '500 x 500 x 20 mm'
  },
  {
    id: 'proj-5',
    title: 'Minimalist Keyboard Case',
    description: 'A two-part gasket-mounted mechanical keyboard enclosure. The bottom weight is machined from solid copper, contrasting beautifully with the matte black anodized aluminum top case.',
    images: ['/images/placeholder.jpg'],
    category: 'Enclosures',
    date: '2024-02-18',
    material: 'Aluminum & Copper',
    dimensions: '320 x 115 x 30 mm'
  },
  {
    id: 'proj-6',
    title: 'Intricate Geometric Wall Panel',
    description: 'Parametrically designed wall panel featuring an aperiodic tiling pattern. V-carved into premium birch plywood, creating deep, sharp shadows that change as ambient light moves throughout the day.',
    images: ['/images/placeholder.jpg'],
    category: 'Decorative',
    date: '2023-09-30',
    material: 'Baltic Birch Plywood',
    dimensions: '1200 x 1200 x 18 mm'
  },
  {
    id: 'proj-7',
    title: 'Heavy Duty Router Mount',
    description: 'A split-clamp style spindle mount designed for an 80mm water-cooled spindle. Beefy design to eliminate chatter during aggressive roughing passes on hard materials.',
    images: ['/images/placeholder.jpg'],
    category: 'Mechanical Parts',
    date: '2024-03-05',
    material: '7075 Aluminum',
    dimensions: '140 x 95 x 80 mm'
  },
  {
    id: 'proj-8',
    title: 'Oak Catch-All Tray',
    description: 'An elegant everyday carry tray with sweeping internal fillets that make it easy to scoop out coins or keys. Machined from quartersawn white oak.',
    images: ['/images/placeholder.jpg'],
    category: 'Decorative',
    date: '2024-04-12',
    material: 'White Oak',
    dimensions: '250 x 150 x 25 mm'
  }
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Universal NEMA 23 Motor Mount',
    description: 'Production-ready files for a rigid NEMA 23 stepper motor mount. Includes slotted mounting holes for belt tensioning. Optimized for 3-axis CNC milling with minimal setups.',
    price: 15.00,
    fileType: 'STEP',
    fileSize: '1.2 MB',
    category: 'Mechanical Parts',
    image: '/images/placeholder.jpg',
    featured: true,
    compatibility: ['Fusion 360', 'SolidWorks', 'FreeCAD'],
    downloads: 342
  },
  {
    id: 'prod-2',
    name: 'Parametric Topo Map - Mount Rainier',
    description: 'High-resolution STL file for 3D relief carving of Mount Rainier. The model is scaled and pre-smoothed for excellent results with a 1/16" or 1/8" ball nose endmill.',
    price: 25.00,
    fileType: 'STL',
    fileSize: '85 MB',
    category: 'Artistic',
    image: '/images/placeholder.jpg',
    featured: true,
    compatibility: ['VCarve Pro', 'Carveco', 'MeshCAM'],
    downloads: 128
  },
  {
    id: 'prod-3',
    name: 'Standard Hold-Down Clamp Set',
    description: 'A set of robust, low-profile hold-down clamps perfect for making out of hardwood or aluminum scrap. Includes 3 different sizes and step block files.',
    price: 8.50,
    fileType: 'DXF',
    fileSize: '450 KB',
    category: 'Jigs & Fixtures',
    image: '/images/placeholder.jpg',
    featured: false,
    compatibility: ['AutoCAD', 'Fusion 360', 'VCarve'],
    downloads: 890
  },
  {
    id: 'prod-4',
    name: 'Geometric Hex Wall Art',
    description: 'A modular hexagonal wall art pattern designed for V-carving. The file is set up to allow for infinite tiling to cover any wall size.',
    price: 12.00,
    fileType: 'DXF',
    fileSize: '2.1 MB',
    category: 'Decorative',
    image: '/images/placeholder.jpg',
    featured: false,
    compatibility: ['VCarve', 'Easel', 'Carbide Create'],
    downloads: 215
  },
  {
    id: 'prod-5',
    name: 'Raspberry Pi 4 Machined Case',
    description: 'Complete CAD for a two-part passive cooling aluminum case for the Raspberry Pi 4. Built-in thermal columns touch the CPU and RAM. Tolerances are dialed in for a slip fit.',
    price: 35.00,
    fileType: 'STEP',
    fileSize: '4.5 MB',
    category: 'Enclosures',
    image: '/images/placeholder.jpg',
    featured: true,
    compatibility: ['Fusion 360', 'Inventor', 'SolidWorks'],
    downloads: 67
  },
  {
    id: 'prod-6',
    name: 'Dust Shoe for 65mm Spindle',
    description: 'A magnetic, split-design dust shoe for 65mm spindles (Makita/Katsu). The split design allows for easy tool changes without removing the entire assembly.',
    price: 18.00,
    fileType: 'STL',
    fileSize: '3.8 MB',
    category: 'Mechanical Parts',
    image: '/images/placeholder.jpg',
    featured: false,
    compatibility: ['3D Printers', 'MeshCAM'],
    downloads: 412
  },
  {
    id: 'prod-7',
    name: 'Mid-Century Modern Plant Stand',
    description: 'Vectors for a flat-pack, interlocking plant stand designed for 3/4" (18mm) plywood. Can be cut on any standard CNC router table.',
    price: 10.00,
    fileType: 'DXF',
    fileSize: '800 KB',
    category: 'Decorative',
    image: '/images/placeholder.jpg',
    featured: false,
    compatibility: ['VCarve', 'Fusion 360', 'AutoCAD'],
    downloads: 305
  },
  {
    id: 'prod-8',
    name: 'Customizable Sign Blank Templates',
    description: 'A collection of 15 classic sign blank shapes (shields, ribbons, ovals) with proper offsetting for clean border carving.',
    price: 15.00,
    fileType: 'DXF',
    fileSize: '1.5 MB',
    category: 'Signs & Lettering',
    image: '/images/placeholder.jpg',
    featured: false,
    compatibility: ['All 2D Vector Software'],
    downloads: 540
  },
  {
    id: 'prod-9',
    name: 'Tramming Tool Hub',
    description: 'Machinable hub for building a precision spindle tramming tool. Requires two dial indicators. Ensures your spindle is perfectly perpendicular to your spoilboard.',
    price: 22.00,
    fileType: 'STEP',
    fileSize: '1.1 MB',
    category: 'Jigs & Fixtures',
    image: '/images/placeholder.jpg',
    featured: true,
    compatibility: ['Fusion 360', 'SolidWorks', 'FreeCAD'],
    downloads: 188
  },
  {
    id: 'prod-10',
    name: 'Pre-Calculated Speeds & Feeds Chart (GCODE Gen)',
    description: 'A specialized macro script for generating optimal GCODE facing operations for surfacing spoilboards based on your machine parameters.',
    price: 5.00,
    fileType: 'GCODE',
    fileSize: '50 KB',
    category: 'Jigs & Fixtures',
    image: '/images/placeholder.jpg',
    featured: false,
    compatibility: ['GRBL', 'Mach3', 'LinuxCNC'],
    downloads: 1024
  }
];
