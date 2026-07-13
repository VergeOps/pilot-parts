const { initSchema } = require('./schema');
const db = require('./db');

initSchema();

const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt > 0) {
  console.log('Database already seeded, skipping.');
  process.exit(0);
}

const insertUser = db.prepare(
  'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
);

const users = [
  ['alice@example.com', 'password123', 'Alice Pilot'],
  ['bob@example.com', 'password123', 'Bob Mechanic'],
  ['carol@example.com', 'password123', 'Carol Student'],
];

for (const [email, password, name] of users) {
  insertUser.run(email, password, name);
}

const insertProduct = db.prepare(`
  INSERT INTO products (sku, name, description, price, category, stock, image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const products = [
  ['AV-001', 'Garmin GNX 375 GPS/ADS-B Receiver', 'Dual-band ADS-B receiver with integrated GPS navigator and WAAS precision approach capability. Displays real-time traffic and weather on a bright sunlight-readable display.', 2895.00, 'Avionics', 100, 'https://placehold.co/300x300?text=AV-001'],
  ['AV-002', 'Stratus 4 ADS-B Receiver', 'Portable ADS-B In receiver with built-in AHRS for backup attitude information. Pairs wirelessly with ForeFlight, Garmin Pilot, and other aviation apps.', 899.00, 'Avionics', 100, 'https://placehold.co/300x300?text=AV-002'],
  ['AV-003', 'Garmin GTX 345 ADS-B Transponder', 'Mode S transponder with integrated dual-band ADS-B In/Out. Meets FAA 2020 ADS-B mandate and provides TIS-B traffic and FIS-B weather.', 1995.00, 'Avionics', 100, 'https://placehold.co/300x300?text=AV-003'],
  ['AV-004', 'Dynon SkyView HDX Display 10"', 'Large-format glass cockpit display with integrated EFIS, EMS, and moving map. Sunlight-readable 10-inch screen with touch and knob controls.', 2650.00, 'Avionics', 100, 'https://placehold.co/300x300?text=AV-004'],
  ['AV-005', 'Garmin GMA 245 Audio Panel', 'Digital audio panel with Bluetooth connectivity and 3D audio processing. Supports simultaneous monitoring of multiple comm and nav radios.', 1195.00, 'Avionics', 100, 'https://placehold.co/300x300?text=AV-005'],
  ['PS-001', 'David Clark H10-13.4 Headset', 'Industry-standard passive noise-attenuating headset trusted by professional pilots worldwide. Gel ear seals provide exceptional comfort on long flights.', 329.00, 'Pilot Supplies', 100, 'https://placehold.co/300x300?text=PS-001'],
  ['PS-002', 'Lightspeed Zulu 3 ANR Headset', 'Premium active noise-reducing headset with Bluetooth and auto-shutoff. Dual-battery architecture provides up to 50 hours of ANR operation.', 850.00, 'Pilot Supplies', 100, 'https://placehold.co/300x300?text=PS-002'],
  ['PS-003', "Sporty's E6B Flight Computer", 'Classic circular slide rule flight computer for airspeed, altitude, fuel, and wind calculations. Durable aluminum construction with clear markings.', 29.95, 'Pilot Supplies', 100, 'https://placehold.co/300x300?text=PS-003'],
  ['PS-004', 'ASA Private Pilot Test Prep 2025', 'Comprehensive FAA written test preparation with all current questions, detailed explanations, and performance tracking. Updated for 2025 test standards.', 39.95, 'Pilot Supplies', 100, 'https://placehold.co/300x300?text=PS-004'],
  ['PS-005', 'ForeFlight Mobile Pro Annual Sub', 'Full-featured flight planning, weather briefing, and in-flight navigation app for iOS. Includes worldwide charts, Jeppesen NavData, and synthetic vision.', 179.99, 'Pilot Supplies', 100, 'https://placehold.co/300x300?text=PS-005'],
  ['HW-001', 'AN3-10A Bolt Hex Head 10-Pack', 'AN3-10A aircraft-grade hex head bolts, 3/16" diameter x 10/16" grip length. Cadmium-plated for corrosion resistance per AN specification.', 4.75, 'Hardware', 100, 'https://placehold.co/300x300?text=HW-001'],
  ['HW-002', 'MS20365-1032 Hex Nut 50-Pack', 'MS20365 all-metal prevailing torque hex nuts, 10-32 thread. Meets MIL-N-25027 specification for aircraft structural applications.', 6.50, 'Hardware', 100, 'https://placehold.co/300x300?text=HW-002'],
  ['HW-003', 'Cotter Pin Assortment Kit 200pc', '200-piece aircraft cotter pin assortment in a labeled compartment box. Includes common sizes from 1/16" to 3/16" diameter in cadmium-plated steel.', 12.95, 'Hardware', 100, 'https://placehold.co/300x300?text=HW-003'],
  ['HW-004', 'Aircraft Grade Safety Wire 1lb', 'One-pound spool of .032" diameter stainless steel safety wire. Meets MS20995 specification for use on engine components, fasteners, and avionics.', 18.50, 'Hardware', 100, 'https://placehold.co/300x300?text=HW-004'],
  ['HW-005', 'Adel Clamp Assortment 40pc', '40-piece Adel loop clamp assortment for securing hoses, wires, and tubing in aircraft. Includes sizes from 3/16" to 1" in cushion-lined aluminum.', 24.95, 'Hardware', 100, 'https://placehold.co/300x300?text=HW-005'],
  ['TL-001', 'Aircraft Safety Wire Twister Pliers', 'Spring-loaded safety wire twister with automatic locking mechanism for consistent twist rates. Ideal for engine baffling, oil plugs, and cowling fasteners.', 44.95, 'Tools', 100, 'https://placehold.co/300x300?text=TL-001'],
  ['TL-002', 'Swivel Head Inspection Mirror', 'Telescoping inspection mirror with 360-degree swivel head for examining hard-to-reach areas. Stainless steel handle extends from 7" to 26".', 16.95, 'Tools', 100, 'https://placehold.co/300x300?text=TL-002'],
  ['TL-003', 'Timing Light Advance Degree Kit', 'Inductive timing light with advance degree dial for precise ignition timing on aircraft piston engines. Works with all 4- and 6-cylinder Lycoming and Continental engines.', 89.95, 'Tools', 100, 'https://placehold.co/300x300?text=TL-003'],
  ['TL-004', 'Borescope 5.5mm USB Camera', 'Semi-rigid borescope with 5.5mm waterproof camera head and LED lighting. Connects via USB for cylinder inspection on laptops and tablets.', 62.00, 'Tools', 100, 'https://placehold.co/300x300?text=TL-004'],
  ['TL-005', 'Torque Wrench 3/8" Drive 150 ft-lb', 'Click-type torque wrench with 3/8" drive and 10–150 ft-lb range. Dual-scale readout in ft-lb and Nm with audible click at target torque.', 135.00, 'Tools', 100, 'https://placehold.co/300x300?text=TL-005'],
  ['EP-001', 'Lycoming O-360 Overhaul Gasket Set', 'Complete engine overhaul gasket set for Lycoming O-360 series engines. Includes all cylinder, crankcase, accessory, and oil system gaskets per Lycoming Service Manual.', 219.00, 'Engines & Parts', 100, 'https://placehold.co/300x300?text=EP-001'],
  ['EP-002', 'Champion Spark Plug REM37BY', 'Fine-wire massive electrode aviation spark plug for Lycoming and Continental engines. REM37BY replaces Champion REM37BY and is equivalent to Tempest UREM37BY.', 18.95, 'Engines & Parts', 100, 'https://placehold.co/300x300?text=EP-002'],
  ['EP-003', 'Aircraft Oil Filter Adapter Kit', 'Full-flow oil filter adapter kit enabling spin-on automotive-style oil filters on Lycoming and Continental engines. Reduces oil change time and improves filtration.', 74.50, 'Engines & Parts', 100, 'https://placehold.co/300x300?text=EP-003'],
  ['SF-001', 'ACR ResQLink 400 PLB', '406 MHz GPS personal locator beacon with 5-year battery life and no subscription fees. Waterproof to 5 meters and activates COSPAS-SARSAT satellite network for global SAR.', 299.00, 'Safety Equipment', 100, 'https://placehold.co/300x300?text=SF-001'],
  ['SF-002', 'Stratus ESG Emergency ELT', '406 MHz emergency locator transmitter with integrated GPS for rapid position accuracy. FAA TSO-C126b and EASA approved; meets international ICAO requirements.', 649.00, 'Safety Equipment', 100, 'https://placehold.co/300x300?text=SF-002'],
];

for (const p of products) {
  insertProduct.run(...p);
}

console.log('Database seeded successfully: 3 users, 25 products.');
