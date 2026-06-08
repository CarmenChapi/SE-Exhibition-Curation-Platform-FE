import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ShareArtwork from "./ShareArt";
import TopButton from "../TopButton";
import ErrorPage from "../ErrorPage";
import MenuCollections from "../MenuCollections";

const apikeyRM = import.meta.env.VITE_API_KEY_RIJKS;

const fetchArtworkDetails = async (artworkId) => {
  // CORRECCIÓN: Se cambió 'www' por 'data' en el subdominio
  const { data } = await axios.get(
    `https://data.rijksmuseum.nl/api/en/collection/${artworkId}?key=${apikeyRM}`
  );
  return data;
};

const RijksMCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading RijksM...</p>;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data?.artObject) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data.artObject;

  // Modificamos el link externo de la web para usar el objectNumber limpio
  const webUrl = `https://www.rijksmuseum.nl/en/collection/${artwork.objectNumber}`;
  const newArtwork = {
    title: artwork.title || "Unknown",
    location: "Rijksmuseum",
    artist: artwork.principalMaker || "Unknown",
    image_url: artwork.webImage?.url || "",
    description: artwork.description || "No description",
  };

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>
      <div>
        <Link to="/home/artgallery/rijksmuseum" className="link-menu">
          <h2>⬅ Rijksmuseum</h2>
        </Link>
      </div>
      <section className="description-section">
        <h2>{artwork.title || "Untitled"}</h2>

        {artwork.webImage?.url ? (
          <img
            src={artwork.webImage.url}
            alt={artwork.title || "Artwork"}
            className="detail-photo"
          />
        ) : (
          <p>No Image Available</p>
        )}

        <p className="description-artwork">
          <strong>Artist:</strong> {artwork.principalMaker || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Description:</strong>{" "}
          {artwork.description || "No description available."}
        </p>
        <p className="description-artwork">
          <strong>Medium:</strong>{" "}
          {artwork.physicalMedium || "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Techniques:</strong>{" "}
          {artwork.techniques?.length > 0 ? artwork.techniques.join(", ") : "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Date:</strong>{" "}
          {artwork.dating?.presentingDate || "Unknown"}
        </p>

        <p className="description-artwork">
          <strong>URL:</strong>{" "}
          <a
            href={webUrl}
            title="See this artwork in www.rijksmuseum.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >
            Visit this artwork on RijksMuseum
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
      <ShareArtwork title={artwork.title} url={webUrl} />
      <TopButton />
    </>
  );
};

export default RijksMCard;
