import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";

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
  //console.log(data.response);

  return (
    <div>
  <BackControl/>
      <h1>{artwork.title ? artwork.title : "Untitle"}</h1>
      <p>
        {artwork.content.freetext.name ? artwork.content.freetext.name[0].content : "Unknown"}
      </p>
      {artwork.webImage ? (
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
        {artwork.content.freetext.notes[0] ? artwork.content.freetext.notes[0].content : "Unknown"}
      </p>
      <p>
        <strong>Type:</strong>{" "}
        {artwork.content.indexedStructured.object_type ? artwork.content.indexedStructured.object_type[0] : "Unknown"}
      </p>
      <p>
        <strong>Topic:</strong>{" "}
        {artwork.content.indexedStructured.topic ? artwork.content.indexedStructured.topic.toString()  : "Unknown"}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {artwork.content.indexedStructured.date
          ? artwork.content.indexedStructured.date
          : "Unknown"}
      </p>

      <a
      href={artwork.content.descriptiveNonRepeating.record_link || "" }
      title="See the item in the Smithsonian website">
        <strong>URL:</strong>{" "}
        {artwork.content.descriptiveNonRepeating.record_link ? artwork.content.descriptiveNonRepeating.record_link : "Link no available"}
      </a>
    </div>
  );
};

export default SmithsonianCard;
