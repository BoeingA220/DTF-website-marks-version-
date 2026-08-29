export const SITE_NAME = "Royal Eye Candy";
export const SITE_TAGLINE = "Custom Printing for Every Idea";
export const SITE_URL = "https://www.royaleyecandy.com";

export const BUSINESS = {
  name: SITE_NAME,
  owner: "Mark Blazek",
  phone: "208-813-5543",
  phoneHref: "tel:2088135543",
  email: "orders@royaleyecandy.com",
  city: "Boise",
  state: "Idaho",
  stateAbbr: "ID",
  addressLine: "Boise, Idaho",
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 5:00 PM" },
    { days: "Saturday", time: "9:00 AM – 2:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  social: {
    facebook: "https://www.facebook.com/royaleyecandy",
    instagram: "https://www.instagram.com/royaleyecandy",
    tiktok: "https://www.tiktok.com/@royaleyecandy",
  },
} as const;

export type NavLink = {
  label: string;
  href: string;
};

/** Flat top-level nav items — "Shop" is handled separately as a dropdown, see SHOP_MENU_GROUPS. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export type ShopMenuGroup = {
  title: string;
  items: { label: string; href: string; description: string }[];
};

export const SHOP_MENU_GROUPS: ShopMenuGroup[] = [
  {
    title: "Print & Apparel",
    items: [
      { label: "DTF Transfers", href: "/shop", description: "Custom heat transfers for any fabric" },
      { label: "Gang Sheets", href: "/gang-sheets", description: "Fill a sheet, save on multiples" },
      { label: "Apparel Printing", href: "/apparel", description: "Tees, hoodies, polos & more" },
      { label: "Sublimation Printing", href: "/sublimation", description: "Mugs, tumblers & blanks" },
    ],
  },
  {
    title: "Large Format & Specialty",
    items: [
      { label: "Stickers", href: "/stickers", description: "Die-cut & kiss-cut, any shape" },
      { label: "Posters & Wide Format", href: "/posters", description: "Event & retail display graphics" },
      { label: "Canvas Prints", href: "/canvas", description: "Gallery-wrapped photo & art prints" },
    ],
  },
  {
    title: "Signs & Vehicle Graphics",
    items: [
      { label: "Storefront Lettering & Signage", href: "/storefront-lettering", description: "Window & interior signs" },
      { label: "Vinyl Printing", href: "/vinyl-printing", description: "Decals, walls & floor graphics" },
      { label: "Vehicle & Truck Wraps", href: "/vehicle-wraps", description: "Full wraps & fleet lettering" },
    ],
  },
];

export const FEATURED_CATEGORIES = [
  {
    title: "DTF Transfers",
    description: "Custom transfers, ready to press on any fabric.",
    href: "/shop",
    icon: "shirt-transfer",
  },
  {
    title: "Gang Sheets",
    description: "Fill a sheet with your designs and save.",
    href: "/gang-sheets",
    icon: "layout-grid",
  },
  {
    title: "Apparel",
    description: "Tees, hoodies, sweatshirts & polos, printed for you.",
    href: "/apparel",
    icon: "shirt",
  },
  {
    title: "Stickers",
    description: "Die-cut & kiss-cut stickers, any shape.",
    href: "/stickers",
    icon: "sticker",
  },
  {
    title: "Sublimation",
    description: "Mugs, tumblers, ornaments & custom blanks.",
    href: "/sublimation",
    icon: "flame",
  },
  {
    title: "Canvas Prints",
    description: "Gallery-wrapped photo & art prints.",
    href: "/canvas",
    icon: "frame",
  },
  {
    title: "Posters & Wide Format",
    description: "Large-format graphics for events & retail.",
    href: "/posters",
    icon: "gallery-vertical",
  },
  {
    title: "Storefront Lettering & Signage",
    description: "Window graphics & interior signs.",
    href: "/storefront-lettering",
    icon: "store",
  },
  {
    title: "Vinyl Printing",
    description: "Decals, wall graphics & floor graphics.",
    href: "/vinyl-printing",
    icon: "scissors",
  },
  {
    title: "Vehicle & Truck Wraps",
    description: "Full wraps, partial wraps & fleet lettering.",
    href: "/vehicle-wraps",
    icon: "truck",
  },
] as const;

export const SEED_REVIEWS = [
  {
    author: "Jenna R.",
    rating: 5,
    body: "Colors came out incredible and the turnaround was way faster than I expected. My gang sheet order was perfectly packed and ready to press.",
  },
  {
    author: "Marcus T.",
    rating: 5,
    body: "Best DTF quality I've found in the Boise area. No minimums made it easy to test a few designs before going big.",
  },
  {
    author: "Casey L.",
    rating: 5,
    body: "Ordered custom stickers for our product packaging and the colors are incredible. Will be a repeat customer.",
  },
] as const;

export const WHY_CHOOSE_US = [
  {
    title: "Veteran Owned",
    description: "A local, veteran-owned Boise small business.",
  },
  {
    title: "Commercial Equipment",
    description: "Industrial DTF printers and presses, not desktop gear.",
  },
  {
    title: "Brilliant Color",
    description: "Vibrant, saturated prints that hold up wash after wash.",
  },
  {
    title: "Fast Turnaround",
    description: "Most orders printed and shipped within days.",
  },
  {
    title: "Boise Production",
    description: "Every transfer is printed right here in Idaho.",
  },
  {
    title: "Premium Materials",
    description: "High-grade film and powder for a soft, durable feel.",
  },
  {
    title: "No Minimum Orders",
    description: "Order exactly what you need, from one-offs to bulk.",
  },
] as const;
