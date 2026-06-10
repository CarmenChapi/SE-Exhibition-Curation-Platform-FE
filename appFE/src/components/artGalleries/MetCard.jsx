import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ShareArtwork from "./ShareArt";
import TopButton from "../TopButton";
import ErrorPage from "../ErrorPage";
import MenuCollections from "../MenuCollections";
import Loading from "../Loading";

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkId}`
  );
  return data;
};

const MetCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading, isError, isSuccess} = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

 
    if (isLoading)
    return <Loading pageLoading="Loading The Metropolitan Museum of Art..." />;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data;
  const artist = artwork.artistDisplayName || "Unknown";
  const newArtwork = {
    title: artwork.title || "Unknown",
    location: artwork.department || "The Metropolitan Museum of Art",
    artist,
    image_url: artwork.primaryImage || "",
    description: artwork.creditLine || "No description",
  };

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>
      <div>
        <Link to="/home/artgallery/met" className="link-menu">
          <h2>⬅ The Metropolitan Museum of Art</h2>
        </Link>
      </div>
    <section className="description-section">
      <h2>{artwork.title}</h2>
      {artwork.primaryImage ? (
        <img
          src={artwork.primaryImage}
          alt={artwork.title}
          className="detail-photo"
        />
      ) : (
        <p>No Image Available</p>
      )}
      <p className="description-artwork">
        <strong>Artist:</strong> {artist}
      </p>
      <p className="description-artwork">
        <strong>Department:</strong>
        {artwork.department ? artwork.department : "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Culture:</strong>
        {artwork.culture ? artwork.culture : "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Medium:</strong> {artwork.medium ? artwork.medium : "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Date:</strong>
        {artwork.objectDate ? artwork.objectDate : "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Credit Line:</strong>
        {artwork.creditLine ? artwork.creditLine : "Unknown"}
      </p>

      <p className="description-artwork">
          <strong>URL:</strong>{" "}
          <a
        href={artwork.objectURL ? artwork.objectURL : "Unknown"}
        title="See this artwork in the www.MetMuseum.org"
        target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >      Visit this artwork on the MET Museum</a>
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
      <ShareArtwork title={artwork.title} url={artwork.objectURL} />

      <TopButton />
    </>
  );
};

export default MetCard;
