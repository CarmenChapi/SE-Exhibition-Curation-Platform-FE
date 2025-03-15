
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.vam.ac.uk/v2/museumobject/${artworkId}`
  );
  return data;
};

const VAMCard = () => {
  const { artId } = useParams(); 
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data;
  const id_image = artwork.meta.images._images_meta[0].assetRef;
  //console.log(id_image);

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        ⬅ Back
      </button>
      <h1 className="text-2xl font-bold mt-4">
        {artwork.record.titles[0].title}
      </h1>
      <p className="text-gray-600">{artwork.record.artistMakerPerson[0] ?  artwork.record.artistMakerPerson[0].name.text : "Unknown" }</p>
      {id_image ? (
        <img
          src={`https://framemark.vam.ac.uk/collections/${id_image}/full/843,/0/default.jpg`}
          alt={artwork.record.titles[0].title}
          className="w-full h-auto mt-4 rounded"
        />
      ) : (
        <p>No Image Available</p>
      )}
         <p>
        <strong>Description:</strong>{" "}
        {artwork.record.summaryDescription ?  artwork.record.summaryDescription : "Unknown"}
      </p>
      <p>
        <strong>Historical Context:</strong>{" "}
        {artwork.record.historicalContext ?  artwork.record.historicalContext : "Unknown"}
      </p>
      <p>
        <strong>Techniques:</strong> {artwork.record.materialsAndTechniques ? artwork.record.materialsAndTechniques :  "Unknown"}
      </p>
      <p>
        <strong>Date:</strong> {artwork.record.productionDates[0].date.text? artwork.record.productionDates[0].date.text  :  "Unknown"}
      </p>
      <p>
        <strong>Credit Line:</strong> {artwork.record.creditLine? artwork.record.creditLine  :  "Unknown"}
      </p>
      <p>
        <strong>URL:</strong>{" "}
        {artwork.meta._links.collection_page.href ? artwork.meta._links.collection_page.href : "Unknown"}
      </p>

    </div>
  );
};

export default VAMCard;
