
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";


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
  //console.log(data);

  return (
    <div>

      <BackControl />

      <h1>{artwork.title}</h1>

      <p>{artwork.artistDisplayName ? artwork.artistDisplayName : "Unknown"}</p>
      {artwork.primaryImage ? (
        <img
          src={artwork.primaryImage}
          alt={artwork.title}
          className="detail-photo"
        />
      ) : (
        <p>No Image Available</p>
      )}
      <p>
        <strong>Department:</strong>
        {artwork.department ? artwork.department : "Unknown"}
      </p>
      <p>
        <strong>Culture:</strong>
        {artwork.culture ? artwork.culture : "Unknown"}
      </p>
      <p>
        <strong>Medium:</strong> {artwork.medium ? artwork.medium : "Unknown"}
      </p>
      <p>
        <strong>Date:</strong>
        {artwork.objectDate ? artwork.objectDate : "Unknown"}
      </p>
      <p>
        <strong>Credit Line:</strong>
        {artwork.creditLine ? artwork.creditLine : "Unknown"}
      </p>

      <a href={artwork.objectURL ? artwork.objectURL : "Unknown"}
      title="See this artwork in the www.MetMuseum.org">

        <strong>URL:</strong>
        {artwork.objectURL ? artwork.objectURL : "Unknown"}
      </a>
    </div>
  );
};

export default MetCard;
