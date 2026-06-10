import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TopButton from "../TopButton";
import ShareArtwork from "./ShareArt";
import ErrorPage from "../ErrorPage";
import MenuCollections from "../MenuCollections";
import Loading from "../Loading";

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
  const { data, error, isLoading, isError, isSuccess} = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });



    if (isLoading)
    return <Loading pageLoading="Loading Europeana..." />;
  if (isError) return<ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data?.object) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data.object;
  const title =
    artwork?.proxies?.[0]?.dcTitle?.en?.[0] ??
    artwork?.proxies?.[1]?.dcTitle?.en?.[0] ??
    "Unknown";
  const artist =
    artwork?.proxies?.[0]?.dcCreator?.en?.[0] ??
    artwork?.proxies?.[1]?.dcCreator?.en?.[0] ??
    "Unknown";
  const description =
    artwork?.proxies?.[0]?.dcDescription?.en?.[0] ??
    artwork?.proxies?.[1]?.dcDescription?.en?.[0] ??
    "No description";
  const imageUrl = artwork?.aggregations?.[0]?.edmIsShownBy || "";
  const artworkUrl = `https://www.europeana.eu/en/item${artId.replaceAll("-", "/")}`;
  const newArtwork = {
    title,
    location: "Europeana",
    artist,
    image_url: imageUrl,
    description,
  };

  return (
    <>
      <nav className="topMenu">
        <MenuCollections />
      </nav>
      <div>
        <Link to="/home/artgallery/europeana" className="link-menu">
          <h2>⬅ Europeana</h2>
        </Link>
      </div>
      <section className="description-section">
        <h2>{title}</h2>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="detail-photo"
          />
        ) : (
          <p>No Image Available</p>
        )}
        <p className="description-artwork">
          <strong>Artist:</strong> {artist}
        </p>
        <p className="description-artwork">
          <strong>Type:</strong>{" "}
           {artwork?.proxies?.[0]?.edmType?.en?.[0] ??
            artwork?.proxies?.[1]?.edmType?.en?.[0] ??
            "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Medium:</strong>{" "}
           {artwork?.proxies?.[0]?.dctermsMedium?.en?.[0]?.toString() ??
            artwork?.proxies?.[1]?.dctermsMedium?.en?.[0]?.toString() ??
            "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Date:</strong>{" "}
           {artwork?.proxies?.[0]?.dcDate?.def?.[0]??
            artwork?.proxies?.[1]?.dcDate?.def?.[0] ??
            "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Description:</strong> {description}
        </p>
        <p className="description-artwork">
          <strong>URL:</strong>{" "}
          <a
            href={artworkUrl}
            title="See this artwork in www.europeana.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >
            Visit this artwork on Europeana
          </a>
        </p>
      </section>

      <div>
        <Link
          to="/home/artgallery/addToCollectionFromApi"
          state={{ artwork: newArtwork }}
          className="btn-add-curator"
        >
          ✨ Add to My Collections ✨
        </Link>
      </div>
      <ShareArtwork title={title} url={artworkUrl} />
      <TopButton />
    </>
  );
};

export default EuropeanaCard;
