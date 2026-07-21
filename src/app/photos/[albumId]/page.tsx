import { notFound } from "next/navigation";
import { albums } from "@/lib/photos";
import AlbumGallery from "@/components/AlbumGallery";

export function generateStaticParams() {
  return albums.map((a) => ({ albumId: a.id }));
}

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const album = albums.find((a) => a.id === albumId);
  if (!album) notFound();
  return <AlbumGallery album={album} />;
}
