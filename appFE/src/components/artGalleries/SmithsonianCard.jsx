import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ShareArtwork from "./ShareArt";
import TopButton from "../TopButton";
import ErrorPage from "../ErrorPage";
import MenuCollections from "../MenuCollections";

const apiKeySmith = import.meta.env.VITE_API_KEY_SMITHSONIAN;

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.si.edu/openaccess/api/v1.0/content/${artworkId}?api_key=${apiKeySmith}`
  );
  return data;
};

const SmithsonianCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });


  if (isLoading) return <p>Loading Smithsonian...</p>;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data?.response) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data.response;
  const artist = artwork.content?.freetext?.name?.[0]?.content || "Unknown";
  const imageUrl =
    artwork.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.content ||
    "";
  const description =
    artwork.content?.freetext?.notes?.[1]?.content || "No description";
  const artworkUrl =
    artwork.content?.descriptiveNonRepeating?.record_link || "";
  const newArtwork = {
    title: artwork.title || "Unknown",
    location: "Smithsonian Institution",
    artist,
    image_url: imageUrl,
    description,
  };

  return (
    <>
    <nav className="topMenu">
      <MenuCollections />
    </nav>
    <div>
      <Link to="/home/artgallery/smithsonian" className="link-menu">
        <h2>⬅ Smithsonian Institution</h2>
      </Link>
    </div>
  <section className="description-section">
      <h2>{artwork.title ? artwork.title : "Untitle"}</h2>
      {imageUrl && (
    <img
      src={imageUrl}
      alt={artwork.title || "Artwork Image"}
      className="detail-photo"
    />
  )
}

{!imageUrl && (
    <p>No Image Available</p>
)}

      <p className="description-artwork">
        <strong>Artist:</strong> {artist}
      </p>
      <p className="description-artwork">
        <strong>Description:</strong>
        {description}
      </p>
      <p className="description-artwork">
        <strong>Type:</strong>
        {artwork.content?.indexedStructured?.object_type?.[0] || "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Topic:</strong>
        {artwork.content?.freetext?.setName?.[1]?.content ??
          artwork.content?.freetext?.setName?.[0]?.content ??
          "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Date:</strong>
        {artwork.content?.indexedStructured?.date?.join?.(", ") ??
          artwork.content?.indexedStructured?.date ??
          "Unknown"}
      </p>

      <p className="description-artwork">
          <strong>URL:</strong>{" "}
          <a
      href={artworkUrl}
      title="See the item in the oficial website"
        target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >      Visit this artwork on Smithsonian</a>
        </p>
      </section>
      <div>
        <Link
          to="/home/artgallery/addToCollectionFromApi"
          state={{ artwork: newArtwork }}
          className="btn-add-curator"
        >
          ✨ Add to My Collections ✨
        </Link>
      </div>
      <ShareArtwork title={artwork.title} url={artworkUrl} />

      <TopButton />
    </>
  );
};

export default SmithsonianCard;
