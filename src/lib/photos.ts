export interface Album {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  date: string;
  fieldLogNo: string;
  description: string;
  coverPhoto: string;
  photos: { src: string; alt: string }[];
}

export const albums: Album[] = [
  {
    id: "downtown-austin",
    title: "Downtown Austin",
    subtitle: "A Photographic Survey of the Known World",
    location: "Austin, Texas",
    date: "Spring 2025",
    fieldLogNo: "Field Log No. 1",
    description:
      "An expedition into the peculiar geometry of Austin's downtown corridor — where brutalist concrete communes with neon signage, and the ghost of something older lingers just beneath the surface of every recently renovated facade. Forty-one frames. A Canon. Considerable amounts of good light.",
    coverPhoto: "/photos/downtown-austin/3R2A5320.jpg",
    photos: [
      { src: "/photos/downtown-austin/3R2A5320.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5322.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5327.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5329.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5330.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5331.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5332.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5334.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5335.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5336.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5338.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5340.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5341.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5342.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5344.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5345.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5346.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5347.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5349.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5351.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5352.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5354.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5356.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5357.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5361.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5362.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5363.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5365.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5370.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5372.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5375.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5378.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5381.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5382.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5385.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5386.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5387.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5392.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5399.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5403.jpg", alt: "Downtown Austin" },
      { src: "/photos/downtown-austin/3R2A5406.jpg", alt: "Downtown Austin" },
    ],
  },
];
