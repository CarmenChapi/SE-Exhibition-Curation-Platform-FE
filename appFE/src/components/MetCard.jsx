
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
  `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkId}`
  );
  return data;
};

const MetCard = () => {
  const { artId } = useParams(); 
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data;
  console.log(data);

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        ⬅ Back
      </button>
      <h1 className="text-2xl font-bold mt-4">
        {artwork.title}
      </h1>
      <p className="text-gray-600">{artwork.artistDisplayName ?  artwork.artistDisplayName : "Unknown" }</p>
      {artwork.primaryImage? (
        <img
          src={artwork.primaryImage}
          alt={artwork.title}
          className="w-full h-auto mt-4 rounded"
        />
      ) : (
        <p>No Image Available</p>
      )}
         <p>
        <strong>Department:</strong>{" "}
        {artwork.department ?  artwork.department : "Unknown"}
      </p>
      <p>
        <strong>Culture:</strong>{" "}
        {artwork.culture ?  artwork.culture : "Unknown"}
      </p>
      <p>
        <strong>Medium:</strong> {artwork.medium ? artwork.medium :  "Unknown"}
      </p>
      <p>
        <strong>Date:</strong> {artwork.objectDate? artwork.objectDate  :  "Unknown"}
      </p>
      <p>
        <strong>Credit Line:</strong> {artwork.creditLine? artwork.creditLine  :  "Unknown"}
      </p>
      <p>
        <strong>URL:</strong>{" "}
        {artwork.objectURL ? artwork.objectURL : "Unknown"}
      </p>

    </div>
  );
};

export default MetCard;
