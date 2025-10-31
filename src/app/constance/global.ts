export type UserRole = "user" | "admin" | "superAdmin" | "sales";

export const USER_ROLE = {
  admin: "admin",
  superAdmin: "superAdmin",
  sales: "sales",
  user: "user",
} as const;

export type TUserRole = keyof typeof USER_ROLE;

export const parentToSubCategories: Record<string, string[]> = {
  'Desktop': [
    "Star PC",
    "Gaming PC",
    "Brand PC",
    "All-in-One PC",
    "Portable Mini PC",
    "Apple iMac",
    "Apple Mac Mini",
    "Apple Mac Studio",
    "Apple Mac Pro",
  ],

  "Laptot": [
    "Gaming Laptop",
    "Premium Ultrabook",
    "Laptop Bag",
    "Laptop Accessories",
    "MacBook",
  ],

  "Monitor": [
    "LED Monitor",
    "Curved Monitor",
    "Gaming Monitor",
    "4K Monitor",
    "Portable Monitor",
    "Touch Monitor",
  ],

  'Phone': [
    "Smartphone",
    "Feature Phone",
    "Mobile Accessories",
  ],

  'Power': [
    "UPS",
    "Mini UPS",
    "Battery",
    "Voltage Stabilizer",
    "Inverter",
    "Solar Panel System",
  ],

  'Tablet': [
    "Android Tablet",
    "Windows Tablet",
    "Drawing Tablet",
    "Tablet Accessories",
  ],

  'Camera': [
    "DSLR Camera",
    "Mirrorless Camera",
    "Action Camera",
    "Security Camera",
    "Camera Lens",
    "Tripod & Gimbal",
  ],

  'Gaming': [
    "VR Headset",
    "Gaming Keyboard",
    "Gaming Mouse",
    "Gaming Chair",
    "Gaming Headset",
  ],

  "Accessories": [
    "Desktop Accessories",
    "Laptot Accessories",
    "Monitor Accessories",
    "Phone Accessories",
    "Power Accessories",
    "Tablet Accessories",
    "Camera Accessories",
    "Gaming Accessories",
    "Tv Accessories",
  ],

  'Tv': [
    "Smart TV",
    "LED TV",
    "4K UHD TV",
    "OLED TV",
    "QLED TV",
    "TV Mount & Stand",
  ],
} as const;

export type ParentCategoryName = keyof typeof parentToSubCategories;
export type SubCategoryName =
  (typeof parentToSubCategories)[ParentCategoryName][number];

export const allBrands: Record<string, string[]> = {
  // 💻 DESKTOP
  "Star PC": [
    "Value Top", "Walton", "Revenger", "Ryzen", "Intel", "Gigabyte",
    "ASRock", "MSI", "ASUS", "Dell", "HP", "Lenovo", "Acer", "MaxGreen", "Antec"
  ],
  "Gaming PC": [
    "MSI", "ASUS ROG", "HP Omen", "Acer Predator", "Gigabyte", "Corsair",
    "Cooler Master", "NZXT", "Thermaltake", "Revenger", "Value Top", "Walton", "Lian Li"
  ],
  "Brand PC": [
    "Dell", "HP", "Lenovo", "Acer", "ASUS", "Apple", "Walton", "Intel", "MSI", "Gigabyte"
  ],
  "All-in-One PC": [
    "HP", "Dell", "Lenovo", "ASUS", "Acer", "Apple", "MSI", "Walton", "Gigabyte"
  ],
  "Portable Mini PC": [
    "Intel NUC", "Zotac", "ASUS", "HP", "Lenovo", "MiniX", "Beelink", "MSI", "Apple Mac Mini"
  ],
  "Apple iMac": ["Apple"],
  "Apple Mac Mini": ["Apple"],
  "Apple Mac Studio": ["Apple"],
  "Apple Mac Pro": ["Apple"],

  // 💼 LAPTOP
  "Gaming Laptop": [
    "ASUS ROG", "MSI", "Acer Predator", "HP Omen", "Gigabyte Aorus",
    "Dell Alienware", "Lenovo Legion", "Razer", "Walton", "Value Top"
  ],
  "Premium Ultrabook": [
    "Apple MacBook", "Dell XPS", "HP Spectre", "ASUS ZenBook",
    "Lenovo Yoga", "Microsoft Surface", "Huawei MateBook", "LG Gram", "Acer Swift"
  ],
  "Laptop Bag": [
    "Targus", "HP", "Dell", "Lenovo", "Samsonite", "Havit", "Adata", "Baseus", "Micropack"
  ],
  "Laptop Accessories": [
    "Logitech", "Razer", "Anker", "Havit", "Micropack", "Baseus", "Adata", "UGREEN", "Orico"
  ],
  "MacBook": ["Apple"],

  // 🖥️ MONITOR
  "LED Monitor": [
    "Samsung", "LG", "Dell", "ASUS", "Acer", "Walton", "Value Top", "HP", "ViewSonic", "BenQ"
  ],
  "Curved Monitor": [
    "Samsung", "LG", "Acer", "ASUS", "MSI", "Walton", "Gigabyte", "BenQ", "Philips"
  ],
  "Gaming Monitor": [
    "ASUS ROG", "MSI", "Acer Predator", "Gigabyte", "Samsung Odyssey",
    "LG UltraGear", "ViewSonic", "BenQ Zowie", "HP", "Walton"
  ],
  "4K Monitor": [
    "Samsung", "LG", "Dell", "BenQ", "ASUS", "Acer", "Gigabyte", "Philips", "ViewSonic"
  ],
  "Portable Monitor": [
    "ASUS", "Lenovo", "HP", "Dell", "AOC", "Walton", "Chuwi", "Gigabyte"
  ],
  "Touch Monitor": [
    "Dell", "HP", "LG", "ASUS", "ViewSonic", "Walton", "Philips"
  ],

  // 📱 PHONE
  "Smartphone": [
    "Samsung", "Apple", "Xiaomi", "Realme", "OnePlus", "Oppo", "Vivo",
    "Walton", "Symphony", "Infinix", "Tecno", "Motorola", "Huawei", "Google Pixel"
  ],
  "Feature Phone": [
    "Nokia", "Walton", "Itel", "Symphony", "Micromax", "Lava", "Maximus", "Konka", "Marcel"
  ],
  "Mobile Accessories": [
    "Anker", "Belkin", "UGREEN", "Baseus", "Awei", "Havit", "Remax", "Joyroom", "Walton", "Value Top"
  ],

  // 🔋 POWER
  "UPS": [
    "Power Guard", "APC", "Power Pac", "Luminous", "Value Top", "Kstar",
    "Prolink", "Walton", "Havit", "Revenger", "Tangent", "MaxGreen"
  ],
  "Mini UPS": [
    "Value Top", "Prolink", "APC", "Walton", "Power Guard", "Revenger", "Kstar", "Power Pac"
  ],
  "Battery": [
    "Power Pac", "Luminous", "Walton", "MaxGreen", "Value Top", "Exide",
    "Revenger", "Rishabh", "Duracell", "Anker"
  ],
  "Voltage Stabilizer": [
    "V-Guard", "Walton", "Value Top", "Kstar", "Power Pac", "APC", "MaxGreen"
  ],
  "Inverter": [
    "Walton", "Luminous", "Power Pac", "Kstar", "Value Top", "APC",
    "MaxGreen", "Exide", "Microtek", "Revenger"
  ],
  "Solar Panel System": [
    "Walton", "Luminous", "JA Solar", "Trina Solar", "Canadian Solar", "SunPower", "Power Pac"
  ],

  // 📲 TABLET
  "Android Tablet": [
    "Samsung", "Lenovo", "Huawei", "Walton", "Symphony", "Realme", "Xiaomi", "Vivo", "Chuwi"
  ],
  "Windows Tablet": [
    "Microsoft Surface", "HP", "Lenovo", "Dell", "ASUS", "Chuwi", "Acer", "Walton"
  ],
  "Drawing Tablet": [
    "Wacom", "XP-Pen", "Huion", "Gaomon", "Veikk", "Apple", "Walton", "UGEE"
  ],

  // 📸 CAMERA
  "DSLR Camera": [
    "Canon", "Nikon", "Sony", "Fujifilm", "Pentax", "Walton", "GoPro", "Kodak", "Panasonic"
  ],
  "Mirrorless Camera": [
    "Sony", "Canon", "Fujifilm", "Panasonic", "Nikon", "Leica", "OM System"
  ],
  "Action Camera": [
    "GoPro", "DJI", "Insta360", "Akaso", "SJCAM", "Walton", "Sony", "Campark"
  ],
  "Security Camera": [
    "Hikvision", "Dahua", "Value Top", "Walton", "Jovision", "TP-Link", "Imou", "Xiaomi", "CP Plus"
  ],
  "Camera Lens": [
    "Canon", "Nikon", "Sony", "Sigma", "Tamron", "Fujifilm", "Tokina", "Walton"
  ],
  "Tripod & Gimbal": [
    "Manfrotto", "DJI", "Zhiyun", "Joby", "Benro", "Walton", "Value Top"
  ],

  // 🎮 GAMING
  "VR Headset": [
    "Meta Quest", "Sony PlayStation VR2", "HTC Vive", "Valve Index", "Pico", "Oculus", "HP Reverb"
  ],
  "Gaming Keyboard": [
    "Razer", "Logitech G", "SteelSeries", "Corsair", "ASUS ROG", "Redragon",
    "Gamdias", "Fantech", "Havit", "Value Top", "Walton"
  ],
  "Gaming Mouse": [
    "Razer", "Logitech G", "SteelSeries", "Corsair", "ASUS ROG", "Redragon",
    "Fantech", "Havit", "Gamdias", "Walton", "Value Top"
  ],
  "Gaming Chair": [
    "DXRacer", "Secretlab", "Fantech", "Gamdias", "Revenger", "Value Top", "Walton", "Cougar"
  ],
  "Gaming Headset": [
    "HyperX", "Razer", "SteelSeries", "Logitech G", "Gamdias", "Fantech",
    "Havit", "Walton", "Value Top"
  ],

  // ⚙️ ACCESSORIES

  "Desktop Accessories": [
    "Logitech",
    "A4Tech",
    "Havit",
    "Fantech",
    "Corsair",
    "Redragon",
    "HP",
    "Dell",
    "ASUS"
  ],

  "Laptot Accessories": [
    "Logitech",
    "Baseus",
    "UGREEN",
    "Anker",
    "Orico",
    "Havit",
    "HP",
    "Dell"
  ],

  "Monitor Accessories": [
    "Dell",
    "HP",
    "Samsung",
    "LG",
    "ASUS",
    "BenQ",
    "VESA",
    "North Bayou"
  ],

  "Phone Accessories": [
    "Anker",
    "Baseus",
    "UGREEN",
    "Belkin",
    "Spigen",
    "ESR",
    "Apple",
    "Samsung"
  ],

  "Power Accessories": [
    "APC",
    "Prolink",
    "Power Guard",
    "Luminous",
    "Anker",
    "Baseus",
    "Value Top",
    "Walton"
  ],

  "Tablet Accessories": [
    "Apple",
    "Logitech",
    "Baseus",
    "UGREEN",
    "Anker",
    "ESR",
    "Spigen",
    "ZAGG"
  ],

  "Camera Accessories": [
    "Canon",
    "Nikon",
    "Sony",
    "GoPro",
    "DJI",
    "Manfrotto",
    "Benro",
    "Zhiyun"
  ],

  "Gaming Accessories": [
    "Razer",
    "Logitech G",
    "SteelSeries",
    "Corsair",
    "ASUS ROG",
    "Fantech",
    "Redragon",
    "HyperX"
  ],

  "Tv Accessories": [
    "Sanus",
    "ECHOGEAR",
    "Vogel’s",
    "Samsung",
    "LG",
    "Philips",
    "TCL",
    "Sony"
  ],


  // 📺 TV
  "Smart TV": [
    "Samsung", "LG", "Sony", "Walton", "TCL", "Hisense", "Mi TV",
    "Panasonic", "Philips", "Vizio", "Vision"
  ],
  "LED TV": [
    "Samsung", "LG", "Sony", "TCL", "Philips", "Walton", "Vision", "Hisense", "Konka"
  ],
  "4K UHD TV": [
    "Samsung", "LG", "Sony", "TCL", "Walton", "Hisense", "Philips", "Haier", "Xiaomi"
  ],
  "OLED TV": [
    "LG", "Sony", "Samsung", "Philips", "Vizio"
  ],
  "QLED TV": [
    "Samsung", "TCL", "Hisense", "Sony", "LG", "Walton"
  ],
  "TV Mount & Stand": [
    "Sanus", "ECHOGEAR", "Vogel’s", "Value Top", "Walton", "Peerless-AV"
  ]
};



export type AllCategoryName = keyof typeof allBrands
export type AllBrendName = typeof allBrands[AllCategoryName][number]              