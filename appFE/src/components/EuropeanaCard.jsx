import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import Footer from "./Footer";
import ShareArtwork from "./ShareArt";

const apiKeyEuro = import.meta.env.VITE_API_KEY_EUROPEANA;

const fetchArtworkDetails = async (artworkId) => {
  const query = `https://api.europeana.eu/record/v2/${artworkId.replaceAll(
    "-",
    "/"
  )}.json?wskey=${apiKeyEuro}`;
  // console.log(query)
  const { data } = await axios.get(query);
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

  if (isLoading) return <p>Loading Europeana Artwork...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data.object;
  //console.log(artwork.proxies[1],   artwork.proxies[1].dcDescription );

  return (
    <>
      <h1 className="Header">Europeana</h1>
      <nav>
        <BackControl />
      </nav>
      <section>
        <h2>
          {  artwork?.proxies?.[0]?.dcTitle?.en?.[0] ??
  artwork?.proxies?.[1]?.dcTitle?.en?.[0] ??
  "Unknown"}
        </h2>
        <p>
          {artwork.proxies[0].dcCreator
            ? artwork.proxies[0].dcCreator.en[0]
            : "Unknown"}
        </p>
        {artwork.aggregations[0].edmIsShownBy ? (
          <img
            src={artwork.aggregations[0].edmIsShownBy}
            alt={
              artwork.proxies[0].dcTitle ? artwork.proxies[0].dcTitle.en : ""
            }
            className="detail-photo"
          />
        ) : (
          <p>No Image Available</p>
        )}
        <p>
          <strong>Type:</strong>{" "}
          {  artwork?.proxies?.[0]?.edmType?.en?.[0] ??
  artwork?.proxies?.[1]?.edmType?.en?.[0] ??
  "Unknown"}
        </p>
        <p>
          <strong>Medium:</strong>{" "}
          {artwork.proxies[0].dctermsMedium
            ? artwork.proxies[0].dctermsMedium.en.toString()
            : artwork.proxies[0].dctermsMedium
            ? artwork.proxies[0].dctermsMedium.en.toString()
            : "Unknown"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {artwork.proxies[0].dcDate
            ? artwork.proxies[0].dcDate.def[0]
            : artwork.proxies[1].dcDate
            ? artwork.proxies[1].dcDate.def[0]
            : "Unknown"}
        </p>
        <p>
          <strong>Description:</strong>
          {artwork.proxies[0].dcDescription
            ? artwork.proxies[0].dcDescription.en[0]
            : artwork.proxies[1].dcDescription
            ? artwork.proxies[1].dcDescription.en[0]
            : "Not available"}
          {/* {artwork.concepts[0].note ? artwork.concepts[0].note.en[0] : ""}*/}
          {artwork.aggregations[0].webResources[0].textAttributionSnippet
            ? artwork.aggregations[0].webResources[0].textAttributionSnippet
            : ""}
        </p>

        <p>
          <strong>URL:</strong>{" "}
          <a
            href={`https://www.europeana.eu/en/item${artId.replaceAll(
              "-",
              "/"
            )}`}
            title="See this artwork in www.europeana.eu"
          >{`https://www.europeana.eu/en/item${artId.replaceAll("-", "/")}`}</a>
        </p>
      </section>

      <ShareArtwork
        title={  artwork?.proxies?.[0]?.dcTitle?.en?.[0] ??
          artwork?.proxies?.[1]?.dcTitle?.en?.[0] ??
          "Untitle"}
        url={`https://www.europeana.eu/en/item${artId.replaceAll("-", "/")}`}
      />

      <Footer />
    </>
  );
};

export default EuropeanaCard;
