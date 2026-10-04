export type ShortFormCategory = 'ALL' | 'UGC' | 'PODCASTS' | 'BRANDS' | 'EVENTS'

export interface UgcProject {
  id: string
  index: string
  title: string
  brand: string
  category: string
  filterCategory: 'UGC' | 'PODCASTS' | 'BRANDS' | 'EVENTS'
  duration: string
  year: string
  videoSrc: string
  poster: string
  description: string
}

export const ugcProjects: UgcProject[] = [
  // BRANDS
  {
    id: 'b1',
    index: '01',
    title: 'Coffee Roasters Reel',
    brand: 'Artisan Coffee',
    category: 'Brand Commercial',
    filterCategory: 'BRANDS',
    duration: '35 Seconds',
    year: '2025',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1791042093/coffe_reel_final.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/a39a250e-b39a-418e-a884-7a17f6853532_x9kugb.jpg',
    description:
      'Dynamic product storytelling highlighting morning rituals, aromatic brewing, and rich textures with rhythmic sound design.'
  },
  {
    id: 'b2',
    index: '02',
    title: 'Hyderabad Pulse',
    brand: 'Urban Culture',
    category: 'Brand Campaign',
    filterCategory: 'BRANDS',
    duration: '40 Seconds',
    year: '2025',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1791042441/hyd-compressed.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/a0e2a280-0ace-4e23-9227-8ee65fe55d71_jemnxn.jpg',
    description:
      'Fast-paced urban promotional edit capturing city architecture, nightlife, and cultural vibrancy with punchy sound sync.'
  },
  {
    id: 'b3',
    index: '03',
    title: 'VLC Salon',
    brand: 'VLC Salon',
    category: 'Promotional Edit',
    filterCategory: 'BRANDS',
    duration: '50 Seconds',
    year: '2025',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1786545840/SaveClip.App_AQOIVnLXmYx7RgZ4Zvk-BQIBW8RPLKgAZfzp2X5fU_9V4hQ2SKeVM5fIG9aRD4lcj29DmXo6iB_nmWpqL15m8xQ2cfYDNJh7QbLkyqY.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/abfbbc28-813e-4b02-b6ca-501bba14102d_nefr1j.jpg',
    description:
      'A promotional edit showcasing luxury salon services through polished visuals, engaging pacing, and modern transitions.'
  },
  {
    id: 'b4',
    index: '04',
    title: 'Wedding Asia Campaign',
    brand: 'Wedding Asia',
    category: 'Advertisement',
    filterCategory: 'BRANDS',
    duration: '36 Seconds',
    year: '2024',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1786545809/sar_4-compressed_1.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/a39a250e-b39a-418e-a884-7a17f6853532_x9kugb.jpg',
    description:
      'A commercial advertisement crafted to highlight premium bridal collections with fluid camera motion and elegant pacing.'
  },
  {
    id: 'b5',
    index: '05',
    title: 'Brand Showcase Reel',
    brand: 'Commercial Client',
    category: 'Product Promo',
    filterCategory: 'BRANDS',
    duration: '32 Seconds',
    year: '2024',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1791041521/VID-20260724-WA0027.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/3c6aec77-aa70-46fe-9d99-4512d84cf279_hzbdxe.jpg',
    description:
      'Punchy product showcase with snappy speed ramps, precision sound effects, and high-retention cuts.'
  },
  {
    id: 'b6',
    index: '06',
    title: 'Commercial Cutdown',
    brand: 'Brand Partner',
    category: 'Social Ad',
    filterCategory: 'BRANDS',
    duration: '28 Seconds',
    year: '2024',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1791041886/DOC-20260915-WA0021.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/b94ab62c-bf36-41df-88a8-e428268acdb1_descoe.jpg',
    description:
      'High-impact social video ad designed for Instagram Reels & TikTok with bold typographic hooks and conversion pacing.'
  },

  // EVENTS
  {
    id: 'e1',
    index: '07',
    title: 'Live Event Recap',
    brand: 'Event Experience',
    category: 'Event Highlight',
    filterCategory: 'EVENTS',
    duration: '45 Seconds',
    year: '2025',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1791042702/pg1d-main-copy.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/b94ab62c-bf36-41df-88a8-e428268acdb1_descoe.jpg',
    description:
      'Immersive live event coverage emphasizing crowd energy, stage performances, and high-tempo beats.'
  },
  {
    id: 'e2',
    index: '08',
    title: 'Tejas 2026 Expo',
    brand: 'University Project Expo',
    category: 'Event Film',
    filterCategory: 'EVENTS',
    duration: '45 Seconds',
    year: '2026',
    videoSrc: 'https://res.cloudinary.com/syipnv4u/video/upload/v1786625542/TEJAS-02_1_1.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/b94ab62c-bf36-41df-88a8-e428268acdb1_descoe.jpg',
    description:
      'Dynamic event recap capturing technological innovation, student inventions, and keynote presentations.'
  },
  {
    id: 'e3',
    index: '09',
    title: 'Wedding Highlights',
    brand: 'Personal Project',
    category: 'Wedding Film',
    filterCategory: 'EVENTS',
    duration: '55 Seconds',
    year: '2025',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1786545815/wedding2-compressed.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/3c6aec77-aa70-46fe-9d99-4512d84cf279_hzbdxe.jpg',
    description:
      'Emotional celebratory film blending candid documentary shots, slow-motion gestures, and warm cinematic grading.'
  },

  // PODCASTS
  {
    id: 'p1',
    index: '10',
    title: 'Studio Conversation',
    brand: 'Independent Podcast',
    category: 'Podcast Edit',
    filterCategory: 'PODCASTS',
    duration: '45 Seconds',
    year: '2024',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1786546739/DEMO_POD-compressed.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1786718386/WhatsApp_Image_2026-08-13_at_18.32.55_lzdvh5.jpg',
    description:
      'Clean multi-cam interview cut with animated captions, audio enhancement, visual b-roll cutaways, and seamless conversational rhythm.'
  },

  // UGC / SOCIAL
  {
    id: 'u1',
    index: '11',
    title: 'Delivery Day Experience',
    brand: 'Creator Story',
    category: 'Automotive UGC',
    filterCategory: 'UGC',
    duration: '59 Seconds',
    year: '2024',
    videoSrc: 'https://res.cloudinary.com/jqfy1wun/video/upload/v1786545901/car-copy.mp4',
    poster: 'https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/a0e2a280-0ace-4e23-9227-8ee65fe55d71_jemnxn.jpg',
    description:
      'Lifestyle delivery reel blending creator excitement, close-up automotive details, and synchronized sound design.'
  },
]