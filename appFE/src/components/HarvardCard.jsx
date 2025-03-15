import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.harvardartmuseums.org/object/${artworkId}?apikey=${apikeyHarvard}`
  );
  return data;
};

const HarvardCard = () => {
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
      <h1 className="text-2xl font-bold mt-4">{artwork.title}</h1>
      <p className="text-gray-600">
        {artwork.people ? artwork.people[0].name : "Unknown"}
      </p>
      {artwork.primaryimageurl ? (
        <img
          src={artwork.primaryimageurl}
          alt={artwork.title}
          className="w-full h-auto mt-4 rounded"
        />
      ) : (
        <p>No Image Available</p>
      )}
      <p>
        <strong>Department:</strong>{" "}
        {artwork.department
          ? artwork.department
          : "Unknown"}
      </p>
      <p>
        <strong>Technique:</strong> {artwork.technique
 ? artwork.technique
 : "Unknown"}
      </p>
      <p>
        <strong>Date:</strong> {artwork.dated ? artwork.dated : "Unknown"}
      </p>
      <strong>Culture:</strong> {artwork.culture ? artwork.culture : "Unknown"}
      <p>
        <strong>Description:</strong>{" "}
        {artwork.verificationleveldescription
          ? artwork.verificationleveldescription
          : "Unknown"}
      </p>
      <p>
        <strong>URL:</strong> {artwork.url ? artwork.url : "Unknown"}
      </p>
    </div>
  );
};

export default HarvardCard;
