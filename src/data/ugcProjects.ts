export interface UgcProject {
  id: string
  index: string
  title: string
  brand: string
  category: string
  duration: string
  year: string
  videoSrc: string
  poster: string
  description: string
}

export const ugcProjects: UgcProject[] = [
  {
    id: 'u1',
    index: '01',
    title: 'Wedding Highlights',
    brand: 'Personal Project',
    category: 'Wedding Film',
    duration: '55 Seconds',
    year: '2025',
    videoSrc: "https://res.cloudinary.com/jqfy1wun/video/upload/v1786545815/wedding2-compressed.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/3c6aec77-aa70-46fe-9d99-4512d84cf279_hzbdxe.jpg",
    description:
      'A cinematic wedding film focused on heartfelt storytelling, elegant color grading, and seamless transitions.'
  },
  {
    id: 'u2',
    index: '02',
    title: 'VLC Salon',
    brand: 'VLC Salon',
    category: 'Promotional Edit',
    duration: '50 Seconds',
    year: '2025',
    videoSrc: "https://res.cloudinary.com/jqfy1wun/video/upload/v1786545840/SaveClip.App_AQOIVnLXmYx7RgZ4Zvk-BQIBW8RPLKgAZfzp2X5fU_9V4hQ2SKeVM5fIG9aRD4lcj29DmXo6iB_nmWpqL15m8xQ2cfYDNJh7QbLkyqY.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/abfbbc28-813e-4b02-b6ca-501bba14102d_nefr1j.jpg",
    description:
      'A promotional edit showcasing salon services through polished visuals, engaging pacing, and modern transitions.'
  },
  {
    id: 'u3',
    index: '03',
    title: 'Wedding Asia',
    brand: 'Wedding Asia',
    category: 'Advertisement',
    duration: '36 Seconds',
    year: '2024',
    videoSrc: "https://res.cloudinary.com/jqfy1wun/video/upload/v1786545809/sar_4-compressed_1.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/a39a250e-b39a-418e-a884-7a17f6853532_x9kugb.jpg",
    description:
      'A commercial advertisement crafted to highlight products with dynamic pacing, clean visuals, and impactful storytelling.'
  },
  {
    id: 'u4',
    index: '04',
    title: 'Delivery Day',
    brand: 'Personal Project',
    category: 'Automotive Edit',
    duration: '59 Seconds',
    year: '2024',
    videoSrc: "https://res.cloudinary.com/jqfy1wun/video/upload/v1786545901/car-copy.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/a0e2a280-0ace-4e23-9227-8ee65fe55d71_jemnxn.jpg",
    description:
      'An automotive cinematic edit capturing the excitement of a new car delivery with smooth motion, rich color grading, and energetic pacing.'
  },
  {
      id: 'u5',
  index: '05',
  title: 'Podcast Editing',
  brand: 'Independent Client',
  category: 'Podcast',
  duration: '45 Seconds',
  year: '2024',
  videoSrc: "https://res.cloudinary.com/jqfy1wun/video/upload/v1786546739/DEMO_POD-compressed.mp4",
  poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1786718386/WhatsApp_Image_2026-08-13_at_18.32.55_lzdvh5.jpg",
  description:
    'A client podcast edit focused on clean cuts, natural pacing, crisp dialogue, and engaging visuals that keep the conversation polished and easy to follow.'
  },
 {
  id: 'u5',
  index: '05',
  title: 'Tejas 2026',
  brand: 'University Project Expo',
  category: 'Event',
  duration: '45 Seconds',
  year: '2026',
  videoSrc: "https://res.cloudinary.com/syipnv4u/video/upload/v1786625542/TEJAS-02_1_1.mp4",
  poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/f_auto,q_auto,w_600/v1783859892/b94ab62c-bf36-41df-88a8-e428268acdb1_descoe.jpg",
  description:
    'A dynamic event edit created for Tejas 2026, the university project expo, featuring student innovations, project showcases, and an energetic visual presentation designed to capture the spirit of technology and creativity.'
}
];