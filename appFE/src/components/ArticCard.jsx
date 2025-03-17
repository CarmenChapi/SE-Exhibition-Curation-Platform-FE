import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.artic.edu/api/v1/artworks/${artworkId}`
  );
  return data;
};

const ArticCard = () => {
  const { artId } = useParams(); // Get artwork ID from URL
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data;
  //console.log(data.data, data.department_title)

  return (
    <div>
      <BackControl/>

      <h1 >{artwork.data.title}</h1>
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

      <p><strong>Date:</strong> {artwork.data.date_display || "Unknown"}</p>
      <p><strong>Description:</strong> {artwork.data.thumbnail.alt_text || "Unknown"}</p>
      <p><strong>Medium:</strong> {artwork.data.medium_display || "Unknown"}</p>
      <p><strong>Type:</strong> {artwork.data.artwork_type_title || "Unknown"}</p>
      <p><strong>Dimensions:</strong> {artwork.data.dimensions || "Unknown"}</p>
      <p><strong>Credit line:</strong> {artwork.data.credit_line || "Unknown"}</p>
      <p><strong>Department:</strong> {artwork.data.department_title || "Unknown"}</p>

      
      
    </div>
  );
};

export default ArticCard;
