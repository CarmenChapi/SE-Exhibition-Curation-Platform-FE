import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";

const apiKeyEuro = import.meta.env.VITE_API_KEY_EUROPEANA;

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.europeana.eu/record/v2/${artworkId.replaceAll(
      "-",
      "/"
    )}.json?wskey=${apiKeyEuro}`
  );
  return data;
};

const EuropeanaCard = () => {
  const { artId } = useParams(); 
  // console.log(artId.replaceAll("-","/"))
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data.object;
  console.log(artwork.proxies[1],   artwork.proxies[1].dcDescription );

  return (
    <div className="p-4">
    <BackControl/>
      <h1 >
        {artwork.proxies[0].dcTitle ? artwork.proxies[0].dcTitle.en : "Unknown"}
      </h1>
      <p >{artwork.proxies[1].dcCreator ?  artwork.proxies[1].dcCreator.def[0] : "Unknown" }</p>
      {artwork.aggregations[0].edmIsShownBy ? (
        <img
          src={artwork.aggregations[0].edmIsShownBy}
          alt={artwork.proxies[0].dcTitle ? artwork.proxies[0].dcTitle.en : "Unknown" }
          className="detail-photo"
        />
      ) : (
        <p>No Image Available</p>
      )}
  
      <p>
        <strong>Type:</strong> {artwork.proxies[0].edmType ? artwork.proxies[0].edmType :  "Unknown"}
      </p>
      <p>
        <strong>Date:</strong> {artwork.proxies[0].dctermsCreated ? artwork.proxies[0].dctermsCreated.def[0] :  "Unknown"}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {artwork.proxies[1].dcDescription ? artwork.proxies[1].dcDescription.de[1] : "Unknown"}
      </p>

    </div>
  );
};

export default EuropeanaCard;
