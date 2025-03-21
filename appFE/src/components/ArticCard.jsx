import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import Footer from "./Footer";
import ShareArtwork from "./ShareArt";




const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.artic.edu/api/v1/artworks/${artworkId}`
  );
  return data;
};

const ArticCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading Art Chicago Institute Artwork...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data;

  return (
    <>
      <h1 className="Header">Art Institute of Chicago</h1>
      <nav>
        <BackControl />
      </nav>

      <section className="collection-card">
        <h2>{artwork.data.title}</h2>
        <p>{artwork.data.artist_display}</p>

        {artwork.data.image_id ? (
          <img
            src={`https://www.artic.edu/iiif/2/${artwork.data.image_id}/full/843,/0/default.jpg`}
            alt={artwork.data.title}
            className="detail-photo"
          />
        ) : (
          <p>No Image Available</p>
        )}

        <p>
          <strong>Date:</strong> {artwork.data.date_display || "Unknown"}
        </p>
        <p>
          <strong>Description:</strong> {artwork.data.description || "Unknown"}
        </p>
        <p>
          <strong>Medium:</strong> {artwork.data.medium_display || "Unknown"}
        </p>
        <p>
          <strong>Type:</strong> {artwork.data.artwork_type_title || "Unknown"}
        </p>
        <p>
          <strong>Dimensions:</strong> {artwork.data.dimensions || "Unknown"}
        </p>
        <p>
          <strong>Credit line:</strong> {artwork.data.credit_line || "Unknown"}
        </p>
        <p>
          <strong>Department:</strong>{" "}
          {artwork.data.department_title || "Unknown"}
        </p>
        <a
          href={`https://www.artic.edu/artworks/${artId}`}
          title="See this artwork in the Chicago Art Institute Website"
        >
          {" "}
          <strong>URL:</strong>
          {`https://www.artic.edu/artworks/${artId}`}
        </a>
      </section>




      <ShareArtwork
        title={artwork.data.title}
        url={`https://www.artic.edu/artworks/${artId}`}
      />



      <Footer />
    </>
  );
};

export default ArticCard;
