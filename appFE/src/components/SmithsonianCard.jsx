import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const apiKeySmith = import.meta.env.VITE_API_KEY_SMITHSONIAN;

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.si.edu/openaccess/api/v1.0/content/${artworkId}?api_key=${apiKeySmith}`
  );
  return data;
};

const SmithsonianCard = () => {
  const { artId } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data.response;
  console.log(data.response);

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        ⬅ Back
      </button>
      <h1 className="text-2xl font-bold mt-4">{artwork.title}</h1>
      <p className="text-gray-600">
        {artwork.content.freetext.name.content ? artwork.content.freetext.name.content : "Unknown"}
      </p>
      {/* {artwork.webImage.url ? (
        <img
          src={artwork.webImage.url}
          alt={artwork.title}
          className="w-full h-auto mt-4 rounded"
        />
      ) : (
        <p>No Image Available</p>
      )} */}
      <p>
        <strong>Description:</strong>{" "}
        {artwork.content.notes ? artwork.content.notes.content : "Unknown"}
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
        {artwork.content.indexedStructured.date
          ? artwork.content.indexedStructured.date
          : "Unknown"}
      </p>

      <p>
        <strong>URL:</strong>{" "}
        {artwork.content.record_link ? artwork.content.record_link : "Unknown"}
      </p>
    </div>
  );
};

export default SmithsonianCard;
