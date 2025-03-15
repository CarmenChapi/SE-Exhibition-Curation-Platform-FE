import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
  console.log(data.object, artwork.proxies[0].year);

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        ⬅ Back
      </button>
      <h1 className="text-2xl font-bold mt-4">
        {artwork.proxies[0].dcTitle.en[0]}
      </h1>
      <p className="text-gray-600">{artwork.proxies[0].dcCreator?.en[0] ?  artwork.proxies[0].dcCreator?.en[0] : "Unknown" }</p>
      {artwork.aggregations[0].edmIsShownBy ? (
        <img
          src={artwork.aggregations[0].edmIsShownBy}
          alt={artwork.proxies[0].dcTitle.en[0]}
          className="w-full h-auto mt-4 rounded"
        />
      ) : (
        <p>No Image Available</p>
      )}
      <p>
        <strong>Location:</strong>{" "}
        {artwork.proxies[0].dcDescription.en[1] ?  artwork.proxies[0].dcDescription.en[1] : "Unknown"}
      </p>
      <p>
        <strong>Type:</strong> {artwork.proxies[0].dcType.en[0] ? artwork.proxies[0].dcType.en[0] :  "Unknown"}
      </p>
      <p>
        <strong>Date:</strong> {artwork.proxies[0].dcDate ? artwork.proxies[0].dcDate.zxx  :  "Unknown"}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {artwork.proxies[0].dcDescription.en[0] ? artwork.proxies[0].dcDescription.en[0] : "Unknown"}
      </p>

    </div>
  );
};

export default EuropeanaCard;
