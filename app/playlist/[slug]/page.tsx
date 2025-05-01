import { getPlaylistInfo } from "@/app/utils";

export default async function Page({ params }: { params: { slug: string } }) {
  // fetch playlist info using youtube api
  const url = `https://yt.lemnoslife.com/playlistItems?part=snippet&playlistId=${params.slug}`;
  const data = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await data.json();
  return <div>Playlist </div>;
}
