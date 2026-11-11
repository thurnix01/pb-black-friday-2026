/*
 * Daily Doorbusters: source of truth for the doorbuster carousel.
 * Mirrors the "Doorbusters" sheet (Black Friday 2026 planning workbook).
 *
 * Each deal goes live at 12:00 AM Pacific on `date` and expires at
 * 12:00 AM Pacific the next day, unless `endsAt` is set.
 *
 *   confirmed  false hides the deal entirely (not ready to advertise)
 *   soldOut    true shows the expired overlay as "Sold out" while still live
 *   endsAt     optional ISO date-time to override the default 24 hour window
 *   image      optional; a branded placeholder is shown when empty. White-background catalog
 *              JPGs (images.amain.com/images/large/...) blend into the card
 *   url        product page link from the spreadsheet
 */
window.BF26_CONFIG = {
  // Pacific Standard Time (DST ends Nov 1, 2026, so the whole sale is UTC-8)
  utcOffset: '-08:00',
  // Show the next upcoming deal's product (price stays locked); false keeps it as a "?" card
  teaseNext: true
};

window.BF26_DOORBUSTERS = [
  {
    date: '2026-11-23',
    label: '',
    product: 'Specialized Ambush 2 Mountain Helmet',
    brand: 'Specialized',
    retail: 179.99,
    sale: 39.99,
    note: '24 hour sale',
    confirmed: true,
    image: 'assets/doorbusters/specialized-ambush-2.png',
    url: 'https://www.performancebike.com/specialized-ambush-2-mountain-helmet-black-m-60222-0823/p1405154?v=1402713'
  },
  {
    date: '2026-11-24',
    label: '',
    product: 'Continental Aero 111 Tubeless Tire (26mm)',
    brand: 'Continental',
    retail: 128.95,
    sale: 69.99,
    note: '',
    confirmed: true,
    image: 'assets/doorbusters/continental-aero-111.png',
    url: 'https://www.performancebike.com/continental-aero-111-tubeless-tire-black-700c-26mm-01020460000/p1609656?v=1585907'
  },
  {
    date: '2026-11-25',
    label: '',
    product: 'Silca Terra Floor Pump',
    brand: 'Silca',
    retail: 139.00,
    sale: 89.00,
    note: 'Drop price, until out of stock',
    confirmed: false,
    image: 'https://images.amain.com/images/large/bikes/silca/am-pu-009-asy-0100.jpg',
    url: 'https://www.performancebike.com/silca-terra-floor-pump-green-tan-am-pu-009-asy-0100/p1455222'
  },
  {
    date: '2026-11-25',
    label: '',
    product: 'Silca Elettrico Mini-Inflator (Micro)',
    brand: 'Silca',
    retail: 129.00,
    sale: 89.00,
    note: 'Drop price, until out of stock',
    confirmed: false,
    image: 'https://images.amain.com/images/large/bikes/silca/am-pu-016-asy-0100.jpg',
    url: 'https://www.performancebike.com/silca-elettrico-miniinflator-gunmetal-red-micro-am-pu-016-asy-0100/p1643330?v=1628974'
  },
  {
    date: '2026-11-26',
    label: 'Thanksgiving',
    product: 'Lezyne KTV Drive/KTV Drive+ Light Set',
    brand: 'Lezyne',
    retail: 49.99,
    sale: 24.99,
    note: 'Discounted light set + free giveaway lights?',
    confirmed: true,
    image: 'https://images.amain.com/images/large/bikes/lezyne/1-led-12p-v704.jpg',
    url: 'https://www.performancebike.com/lezyne-ktv-drive-ktv-drive-light-set-black-1-led-12p-v704/p1491393'
  },
  {
    date: '2026-11-27',
    label: 'Black Friday',
    product: 'PNW Components Range Composite Pedals',
    brand: 'PNW Components',
    retail: 49.00,
    sale: 29.40,
    note: '100 units, coupon required, until out of stock',
    confirmed: true,
    image: 'https://images.amain.com/images/large/bikes/pnw-components/rcpbb.jpg',
    url: 'https://www.performancebike.com/pnw-components-range-composite-pedals-blackout-black-rcpbb/p1415353'
  },
  {
    date: '2026-11-28',
    label: '',
    product: 'Ritchey Outback Frameset (Aurora)',
    brand: 'Ritchey',
    retail: 1599.00,
    sale: 899.99,
    note: 'Drop price, until out of stock',
    confirmed: true,
    image: 'https://images.amain.com/images/large/bikes/ritchey/96052817004.jpg',
    url: 'https://www.performancebike.com/ritchey-outback-frameset-aurora-l-96052817004/p1874522?v=1872045'
  },
  {
    date: '2026-11-29',
    label: '',
    product: 'Feedback Sports Reflex Fixed Torque Ratchet Kit',
    brand: 'Feedback Sports',
    retail: 65.00,
    sale: 39.00,
    note: '50 units, drop price, until out of stock',
    confirmed: true,
    image: 'https://images.amain.com/images/large/bikes/feedback/17817.jpg',
    url: 'https://www.performancebike.com/feedback-sports-reflex-fixed-torque-ratchet-kit-5nm-17817/p1502502?v=1487734'
  },
  {
    date: '2026-11-30',
    label: 'Cyber Monday',
    product: 'Schwalbe G-One All Around Tubeless Gravel Tire',
    brand: 'Schwalbe',
    retail: 75.33,
    sale: 24.99,
    note: 'Drop price, until out of stock',
    confirmed: true,
    image: 'https://images.amain.com/images/large/bikes/schwalbe/11600766.02.jpg',
    url: 'https://www.performancebike.com/schwalbe-gone-all-around-tubeless-gravel-tire-black-700c-40mm-11600766.02/p1315526?v=1262340'
  }
];
