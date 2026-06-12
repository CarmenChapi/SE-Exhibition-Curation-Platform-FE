import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BackControl from "../BackControl";
import TopButton from "../TopButton";
import ShareArtwork from "./ShareArt";
import ErrorPage from "../ErrorPage";
import MenuCollections from "../MenuCollections";
import AddToCollectionFromApi from "./AddToCollectionFromApi";
const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;
import Loading from "../Loading";

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.harvardartmuseums.org/object/${artworkId}?apikey=${apikeyHarvard}`
  );
  if (!data) {
    throw new Error("Artwork not found");
  }
  return data;
};

const HarvardCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

    if (isLoading)
    return <Loading pageLoading="Loading Harvard Art Museum..." />;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`} />;
  if (isSuccess && !data) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`} />;
  }

  const artwork = data;
  const artistName = artwork.people?.[0]?.name || "Unknown";
  const newArtwork = {
    title: artwork.title || "Unknown",
    location: artwork.culture || "Unknown",
    artist: artistName,
    image_url: artwork.primaryimageurl || "",
    description: artwork.verificationleveldescription || "No description",
  };
  return (
    <>
      <nav className="topMenu">
        <MenuCollections />


      </nav>
      <div>
           <Link to="/home/artgallery/harvard" className="link-menu">
             <h2>⬅ Harvard Art Museum</h2>

      </Link>
      </div>


      <section className="description-section">
        <h2>{artwork.title}</h2>
        {artwork.primaryimageurl ? (
          <img
            src={artwork.primaryimageurl}
            alt={artwork.title}
            className="detail-photo"
          />
        ) : (
          <p>No Image Available</p>
        )}
        <p className="description-artwork">
          <strong>Title:</strong> {artwork.title ? artwork.title : "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>People:</strong> {artistName}
        </p>
        <p className="description-artwork">
          <strong>Department:</strong>{" "}
          {artwork.department ? artwork.department : "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Technique:</strong>{" "}
          {artwork.technique ? artwork.technique : "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Date:</strong> {artwork.dated ? artwork.dated : "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Culture:</strong>{" "}
          {artwork.culture ? artwork.culture : "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>Description:</strong>{" "}
          {artwork.verificationleveldescription
            ? artwork.verificationleveldescription
            : "Unknown"}
        </p>
        <p className="description-artwork">
          <strong>URL:</strong>{" "}
          <a
            href={artwork.url ? artwork.url : "Unknown"}
            title="See this artwork in www.HarvardMuseum.org"
            target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >
            Visit this artwork on Harvard Museum for more information
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

      <ShareArtwork title={artwork.title} url={artwork.url} />

      <TopButton />

    </>
  );
};

export default HarvardCard;
