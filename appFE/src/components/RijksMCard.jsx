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
  console.log(data.artObject);

  return (
    <div className="p-4">
      <BackControl/>
      <h1 className="text-2xl font-bold mt-4">{artwork.title}</h1>
      <p className="text-gray-600">
        {artwork.principalMaker ? artwork.principalMaker : "Unknown"}
      </p>
      {artwork.webImage.url ? (
        <img
          src={artwork.webImage.url}
          alt={artwork.title}
          className="w-full h-auto mt-4 rounded"
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
        {artwork.techniques ? artwork.techniques : "Unknown"}
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
        href= {artwork.id ? `http://www.rijksmuseum.nl/en/collection/${artwork.id.slice(3)}` : "Unknown"}>  {artwork.id ? `http://www.rijksmuseum.nl/en/collection/${artwork.id.slice(3)}` : "Unknown"}
      </a>
    </div>
  );
};

export default RijksMCard;
