import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TopButton from "../TopButton";
import ShareArtwork from "./ShareArt";
import ErrorPage from "../ErrorPage";
import MenuCollections from "../MenuCollections";

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.artic.edu/api/v1/artworks/${artworkId}`
  );
  return data;
};

const ArticCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading ,  isError, isSuccess} = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });


  
  if (isLoading) return <p>Loading Chicago...</p>;
  if (isError) return <ErrorPage errorMsg={error.message}/>;
  if (isSuccess && !data?.data) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data.data;
  const imageUrl = artwork.image_id
    ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
    : "";
  const artworkUrl = `https://www.artic.edu/artworks/${artId}`;
  const newArtwork = {
    title: artwork.title || "Unknown",
    location: artwork.department_title || "Art Institute of Chicago",
    artist: artwork.artist_display || "Unknown",
    image_url: imageUrl,
    description: artwork.description || "No description",
  };

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>
      <div>
        <Link to="/home/artgallery/chicago" className="link-menu">
          <h2>⬅ Art Institute of Chicago</h2>
        </Link>
      </div>

      <section className="description-section">
        <h2>{artwork.title}</h2>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={artwork.title}
            className="detail-photo"
          />
        ) : (
          <p>No Image Available</p>
        )}

        <p className="description-artwork">
          <strong>Artist:</strong> {artwork.artist_display || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Date:</strong> {artwork.date_display || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Description:</strong> {artwork.description || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Medium:</strong> {artwork.medium_display || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Type:</strong> {artwork.artwork_type_title || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Dimensions:</strong> {artwork.dimensions || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Credit line:</strong> {artwork.credit_line || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Department:</strong>{" "}
          {artwork.department_title || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>URL:</strong>{" "}
          <a
            href={artworkUrl}
            title="See this artwork in the Chicago Art Institute Website"
            target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >
            Visit this artwork on Chicago Art Institute
          </a>
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
      <ShareArtwork
        title={artwork.title}
        url={artworkUrl}
      />
      <TopButton />
    </>
  );
};

export default ArticCard;
