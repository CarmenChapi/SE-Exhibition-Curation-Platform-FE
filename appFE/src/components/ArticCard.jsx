import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.artic.edu/api/v1/artworks/${artworkId}?fields=id,title,image_id,artist_display,date_display,medium_display,dimensions`
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

  const artwork = data.data;

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded">
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold mt-4">{artwork.title}</h1>
      <p className="text-gray-600">{artwork.artist_display}</p>

      {artwork.image_id ? (
        <img
          src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
          alt={artwork.title}
          className="w-full h-auto mt-4 rounded"
        />
      ) : (
        <p>No Image Available</p>
      )}

      <p><strong>Date:</strong> {artwork.date_display || "Unknown"}</p>
      <p><strong>Medium:</strong> {artwork.medium_display || "Unknown"}</p>
      <p><strong>Dimensions:</strong> {artwork.dimensions || "Unknown"}</p>
    </div>
  );
};

export default ArticCard;
