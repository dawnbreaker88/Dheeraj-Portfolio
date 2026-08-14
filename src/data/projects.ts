// Portfolio project data — replace video/thumbnail srcs with real assets
export interface Project {
  id: string
  index: string
  title: string
  category: string
  duration: string
  client: string
  year: string
  videoSrc: string
  thumbnail: string
  description: string
}

export const projects: Project[] = [
  {
    id: 'p1',
    index: '01',
    title: 'Synergy 2026',
    category: 'Event Highlight',
    duration: '30 Seconds',
    client: 'Anurag University',
    year: '2026',
    videoSrc: "https://res.cloudinary.com/syipnv4u/video/upload/v1786549065/SY2-compressed.mp4",
    thumbnail: '',
    description:
      'A high-energy event highlight capturing the excitement, performances, and unforgettable moments from Synergy 2026, Anurag University’s annual cultural festival.',
  },
  {
    id: 'p2',
    index: '02',
    title: 'Graduation 2025',
    category: 'Graduation Highlight',
    duration: '60 Seconds',
    client: 'Anurag University',
    year: '2025',
    videoSrc: "https://res.cloudinary.com/syipnv4u/video/upload/v1786549107/Convocation.mp4",
    thumbnail: '',
    description:
      'A fast-paced graduation recap celebrating the achievements, emotions, and memories of the Anurag University Class of 2025.',
  },
  {
    id: 'p3',
    index: '03',
    title: 'Luminor',
    category: 'Event Aftermovie',
    duration: '2 Minutes',
    client: 'Anurag University',
    year: '2024',
    videoSrc: "https://res.cloudinary.com/syipnv4u/video/upload/v1786549136/WS_-_EDIT_20.mp4",
    thumbnail: '',
    description:
      'A dynamic aftermovie bringing together the best moments of Luminor through engaging pacing, clean transitions, and vibrant visuals.',
  },
  {
    id: 'p4',
    index: '04',
    title: 'Sportabout',
    category: 'Sports Highlight',
    duration: '45 Seconds',
    client: 'Anurag University',
    year: '2024',
    videoSrc: "https://res.cloudinary.com/syipnv4u/video/upload/v1786549385/sports_bout.mp4",
    thumbnail: '',
    description:
      'An energetic sports highlight capturing the intensity, teamwork, and competitive spirit of Anurag University’s annual Sportabout event.',
  },
  {
    id: 'p5',
    index: '05',
    title: 'Bathukamma',
    category: 'Cultural Highlight',
    duration: '8 Minutes',
    client: 'Anurag University',
    year: '2024',
    videoSrc: "https://res.cloudinary.com/syipnv4u/video/upload/v1786549146/FESTIVAL.mp4",
    thumbnail: '',
    description:
      'A vibrant cultural highlight showcasing the traditions, celebrations, and community spirit of Bathukamma at Anurag University.',
  },
];