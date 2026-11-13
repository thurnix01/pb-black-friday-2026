/*
 * Daily Brand Deals: brand discount cards, one set per day.
 * Mirrors "PB_Black_Friday_Page_Plan_2026" (Daily Page Plan: Brand Tile 1-6; Brand Sale Calendar: everyday brands).
 *
 * Each day switches at 12:00 AM Pacific (BF26_CONFIG.utcOffset in doorbusters-data.js).
 * Before the first day / after the last, the nearest day is shown.
 * Tiles are written as in the sheet: "Brand (label)". "(Deals)" or no label shows "Shop deals".
 */

// Logos: SVGs from the "All Logos" Figma file (Cycling Logos frame) in assets/brands/; brands not in that
// file are traced from the brand's own logo. id = the brand's site ID (performancebike.com/.../b<id>),
// used for the Black Friday results link (?fb=<id>). `url` sends the card somewhere else instead (e.g. the
// brand's own Black Friday page). `as` shows another brand's card with extra wording.
window.BF26_BRANDS = {
  'Specialized': { logo: 'assets/brands/specialized.svg', id: 2231, url: 'https://www.performancebike.com/specialized/b2231' },
  'SRAM': { logo: 'assets/brands/sram.svg', id: 1509 },
  'Shimano': { logo: 'assets/brands/shimano.svg', id: 1468 },
  'Continental': { logo: 'assets/brands/continental.svg', id: 1046 },
  'Fizik': { logo: 'assets/brands/fizik.svg', id: 1136 },
  'Crankbrothers': { logo: 'assets/brands/crankbrothers.svg', id: 1051 },
  'Brooks': { logo: 'assets/brands/brooks.svg', id: 995 },
  'Met Helmets': { logo: 'assets/brands/met.svg', id: 2232 },
  'Selle Royal': { logo: 'assets/brands/selle_royal.svg', id: 1464 },
  'Pirelli': { logo: 'assets/brands/pirelli.svg', id: 2609 },
  'Garmin': { logo: 'assets/brands/garmin.svg', id: 1155 },
  'Pearl Izumi': { logo: 'assets/brands/pearl-izumi.svg', id: 1368 },
  'Silca': { logo: 'assets/brands/silca.svg', id: 1472 },
  'Vittoria': { logo: 'assets/brands/vittoria.svg', id: 1622 },
  'Ritchey': { logo: 'assets/brands/ritchey.svg', id: 1430 },
  'Lezyne': { logo: 'assets/brands/lezyne.svg', id: 1268 },
  'PNW': { logo: 'assets/brands/pnw.svg', id: 2223 },
  'Feedback Sports': { logo: 'assets/brands/feedback-sports.svg', id: 1129 },
  'Schwalbe': { logo: 'assets/brands/schwalbe.svg', id: 1456 },
  'Lazer': { logo: 'assets/brands/lazer.svg', id: 1265 },
  'Terry': { logo: 'assets/brands/terry.svg', id: 1561 },
  'Delta': { logo: 'assets/brands/delta.svg', id: 1074 }, // traced from Delta's site logo (no vector available)
  'WTB': { logo: 'assets/brands/wtb.svg', id: 1653 },
  'Almsthre': { logo: 'assets/brands/almsthre.svg', id: 4284 }, // traced from Almsthre's site logo (no vector available)
  'Continental Tire': { as: 'Continental' },
  'Shimano FTW': { as: 'Shimano', note: 'shoes' },
  'Shimano HG': { as: 'Shimano', note: 'pedals & wheels' }
};

// On every version of the page, in this order. Discounts come from the Brand Sale Calendar
// (Specialized and SRAM have no window there). A matching brand tile for the day replaces it in place.
window.BF26_EVERYDAY_BRANDS = [
  { name: 'Specialized' },
  { name: 'SRAM' },
  { name: 'Shimano', sales: [{ from: '2026-11-27', to: '2026-12-07', label: '25% off' }] },
  { name: 'Continental', sales: [{ from: '2026-11-24', to: '2026-11-30', label: '20% off' }] }
];

window.BF26_BRAND_DAYS = {
  '2026-11-06': ['Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)', 'Selle Royal (20-25% off)'],
  '2026-11-07': ['Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)', 'Selle Royal (20-25% off)'],
  '2026-11-08': ['Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)', 'Selle Royal (20-25% off)'],
  '2026-11-09': ['Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)', 'Selle Royal (20-25% off)'],
  '2026-11-10': ['Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)', 'Selle Royal (20-25% off)', 'Pirelli (20% off)'],
  '2026-11-11': ['Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)', 'Selle Royal (20-25% off)', 'Pirelli (20% off)'],
  '2026-11-12': ['Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)', 'Selle Royal (20-25% off)', 'Almsthre (25% off)'],
  '2026-11-13': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)'],
  '2026-11-14': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)'],
  '2026-11-15': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Met Helmets (Deals)'],
  '2026-11-16': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Delta (20% off)'],
  '2026-11-17': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)', 'Delta (20% off)'],
  '2026-11-18': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)'],
  '2026-11-19': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)', 'Brooks (20-25% off)'],
  '2026-11-20': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Vittoria (25% off)', 'Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)'],
  '2026-11-21': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Vittoria (25% off)', 'Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)'],
  '2026-11-22': ['Pearl Izumi (25-30% off)', 'Garmin (10-30% off)', 'Vittoria (25% off)', 'Silca (Deals)', 'Fizik (20-25% off)', 'Crankbrothers (20-25% off)'],
  '2026-11-23': ['Pearl Izumi (25-30% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Vittoria (25% off)', 'Silca (Deals)', 'Fizik (20-25% off)'],
  '2026-11-24': ['Continental Tire (20% off)', 'Pearl Izumi (25-30% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Silca (Deals)', 'Fizik (20-25% off)'],
  '2026-11-25': ['Silca (Deals)', 'Continental Tire (20% off)', 'Pearl Izumi (25-30% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)'],
  '2026-11-26': ['Lezyne (~25% off)', 'Continental Tire (20% off)', 'Pearl Izumi (25-30% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Silca (Deals)'],
  '2026-11-27': ['PNW (20% off)', 'Continental Tire (20% off)', 'Shimano FTW (25% off)', 'Pearl Izumi (25-30% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)'],
  '2026-11-28': ['Ritchey (20-30% off)', 'Continental Tire (20% off)', 'Shimano FTW (25% off)', 'Pearl Izumi (25-30% off)', 'Shimano HG (25% off)', 'Garmin (10-30% off)'],
  '2026-11-29': ['Feedback Sports (20% off)', 'Continental Tire (20% off)', 'Shimano FTW (25% off)', 'Pearl Izumi (25-30% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)'],
  '2026-11-30': ['Schwalbe (20% off)', 'Continental Tire (20% off)', 'Shimano FTW (25% off)', 'Pearl Izumi (25-30% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)'],
  '2026-12-01': ['Shimano FTW (25% off)', 'Pearl Izumi (25-30% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)'],
  '2026-12-02': ['Shimano FTW (25% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)', 'Lazer (25% off)'],
  '2026-12-03': ['Shimano FTW (25% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Fizik (20-25% off)', 'Lazer (25% off)'],
  '2026-12-04': ['Shimano FTW (25% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Lazer (25% off)', 'Terry (25% off)'],
  '2026-12-05': ['Shimano FTW (25% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Lazer (25% off)', 'Terry (25% off)'],
  '2026-12-06': ['Shimano FTW (25% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Lazer (25% off)', 'Terry (25% off)'],
  '2026-12-07': ['Shimano FTW (25% off)', 'Shimano HG (25% off)', 'Ritchey (20-30% off)', 'Garmin (10-30% off)', 'Lazer (25% off)', 'Terry (25% off)'],
  '2026-12-08': ['Garmin (10-30% off)', 'Brooks (20-25% off)', 'Delta (20% off)', 'Met Helmets (Deals)', 'WTB (25% off)', 'Selle Royal (20-25% off)'],
  '2026-12-09': ['Garmin (10-30% off)', 'Brooks (20-25% off)', 'Delta (20% off)', 'Met Helmets (Deals)', 'WTB (25% off)', 'Selle Royal (20-25% off)'],
  '2026-12-10': ['Garmin (10-30% off)', 'Brooks (20-25% off)', 'Delta (20% off)', 'Met Helmets (Deals)', 'WTB (25% off)', 'Selle Royal (20-25% off)'],
  '2026-12-11': ['Garmin (10-30% off)', 'Brooks (20-25% off)', 'Delta (20% off)', 'Met Helmets (Deals)', 'WTB (25% off)', 'Selle Royal (20-25% off)'],
  '2026-12-12': ['Garmin (10-30% off)', 'Brooks (20-25% off)', 'Delta (20% off)', 'Met Helmets (Deals)', 'WTB (25% off)', 'Selle Royal (20-25% off)'],
  '2026-12-13': ['Garmin (10-30% off)', 'Brooks (20-25% off)', 'Delta (20% off)', 'Met Helmets (Deals)', 'WTB (25% off)', 'Selle Royal (20-25% off)'],
  '2026-12-14': ['Garmin (10-30% off)', 'Brooks (20-25% off)', 'Delta (20% off)', 'Met Helmets (Deals)', 'WTB (25% off)', 'Selle Royal (20-25% off)']
};
