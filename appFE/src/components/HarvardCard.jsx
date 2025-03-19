import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import Footer from "./Footer";
import ShareArtwork from "./ShareArt";

const apikeyHarvard = import.meta.env.VITE_API_KEY_HARVARD;

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.harvardartmuseums.org/object/${artworkId}?apikey=${apikeyHarvard}`
  );
  return data;
};

const HarvardCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading Harvard Museum Artwork...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const artwork = data;
  console.log(data);

  return (
    <>
      <h1>Harvard Art Museum</h1>
      <nav>
        <BackControl />
      </nav>

      <section>
        <h2>{artwork.title}</h2>
        <p>{artwork.people ? artwork.people[0].name : "Unknown"}</p>
        {artwork.primaryimageurl ? (
          <img
            src={artwork.primaryimageurl}
            alt={artwork.title}
            className="detail-photo"
          />
        ) : (
          <p>No Image Available</p>
        )}
        <p>
          <strong>Department:</strong>{" "}
          {artwork.department ? artwork.department : "Unknown"}
        </p>
        <p>
          <strong>Technique:</strong>{" "}
          {artwork.technique ? artwork.technique : "Unknown"}
        </p>
        <p>
          <strong>Date:</strong> {artwork.dated ? artwork.dated : "Unknown"}
        </p>
        <strong>Culture:</strong>{" "}
        {artwork.culture ? artwork.culture : "Unknown"}
        <p>
          <strong>Description:</strong>{" "}
          {artwork.verificationleveldescription
            ? artwork.verificationleveldescription
            : "Unknown"}
        </p>
        <a
          href={artwork.url ? artwork.url : "Unknown"}
          title="See this artwork in www.HarvardMuseum.org"
        >
          {" "}
          <strong>URL:</strong>
          {artwork.url ? artwork.url : "Unknown"}
        </a>
      </section>

      <ShareArtwork title={artwork.title} url={artwork.url} />

      <Footer />
    </>
  );
};

export default HarvardCard;
