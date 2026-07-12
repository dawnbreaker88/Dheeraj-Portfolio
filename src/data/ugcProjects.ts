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
    videoSrc: "https://res.cloudinary.com/ady5ycld/video/upload/v1783843583/wedding2-compressed_oh2wv8.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/v1783859892/3c6aec77-aa70-46fe-9d99-4512d84cf279_hzbdxe.jpg",
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
    videoSrc: "https://res.cloudinary.com/ady5ycld/video/upload/v1783842022/SaveClip.App_AQOIVnLXmYx7RgZ4Zvk-BQIBW8RPLKgAZfzp2X5fU_9V4hQ2SKeVM5fIG9aRD4lcj29DmXo6iB_nmWpqL15m8xQ2cfYDNJh7QbLkyqY_lsiptw.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/v1783859892/abfbbc28-813e-4b02-b6ca-501bba14102d_nefr1j.jpg",
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
    videoSrc: "https://res.cloudinary.com/ady5ycld/video/upload/v1783843463/sar_4-compressed_ant1ex.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/v1783859892/a39a250e-b39a-418e-a884-7a17f6853532_x9kugb.jpg",
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
    videoSrc: "https://res.cloudinary.com/ady5ycld/video/upload/v1783842936/car-copy_1_dkitet.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/v1783859892/a0e2a280-0ace-4e23-9227-8ee65fe55d71_jemnxn.jpg",
    description:
      'An automotive cinematic edit capturing the excitement of a new car delivery with smooth motion, rich color grading, and energetic pacing.'
  },
  {
    id: 'u5',
    index: '05',
    title: 'Project Expo',
    brand: 'College Media Club',
    category: 'Event Showcase',
    duration: '45 Seconds',
    year: '2024',
    videoSrc: "https://res.cloudinary.com/ady5ycld/video/upload/v1783842557/TEJAS-02_1_1_gudzcc.mp4",
    poster: "https://res.cloudinary.com/cfqdlsg4/image/upload/v1783859892/b94ab62c-bf36-41df-88a8-e428268acdb1_descoe.jpg",
    description:
      'An event showcase highlighting student innovations through clean edits, balanced pacing, and a polished visual presentation.'
  }
];