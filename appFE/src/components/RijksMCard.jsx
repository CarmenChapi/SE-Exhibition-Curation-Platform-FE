import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";

const apikeyRM = import.meta.env.VITE_API_KEY_RIJKS;

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://www.rijksmuseum.nl/api/en/collection/${artworkId}?key=${apikeyRM}`
  );
  return data;
};

const RijksMCard = () => {
  const { artId } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data.artObject;
  //console.log(data.artObject);

  return (
    <div className="p-4">
      <BackControl/>
      <h1>{artwork.title}</h1>
      <p>
        {artwork.principalMaker ? artwork.principalMaker : "Unknown"}
      </p>
      {artwork.webImage.url ? (
        <img
          src={artwork.webImage.url}
          alt={artwork.title}
                  className="detail-photo"
        />
      ) : (
        <p>No Image Available</p>
      )}
      <p>
        <strong>Description:</strong>{" "}
        {artwork.description ? artwork.description : "Unknown"}
      </p>
      <p>
        <strong>Medium:</strong>{" "}
        {artwork.physicalMedium ? artwork.physicalMedium : "Unknown"}
      </p>
      <p>
        <strong>Techniques:</strong>{" "}
        {artwork.techniques.length > 0 ? artwork.techniques.toString() : "Unknown"}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {artwork.dating.presentingDate
          ? artwork.dating.presentingDate
          : "Unknown"}
      </p>

      <p>
        <strong>URL:</strong>{" "}
      </p>
      <a
        href= {artwork.id ? `http://www.rijksmuseum.nl/en/collection/${artwork.id.slice(3)}` : ""}
        title="See this artwork in www.rijksmuseum.nl">  {artwork.id ? `http://www.rijksmuseum.nl/en/collection/${artwork.id.slice(3)}` : "Unknown"}
      </a>
    </div>
  );
};

export default RijksMCard;
