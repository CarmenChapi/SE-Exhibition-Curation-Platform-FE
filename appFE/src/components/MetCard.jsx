import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import ShareArtwork from "./ShareArt";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";


const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkId}`
  );
  return data;
};

const MetCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading, isError, isSuccess} = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

 
  if (isLoading) return <p>Loading MET...</p>;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data;
  //console.log(data);

  return (
    <>
      <h1>The Metropolitan Museum of Art</h1>
      <nav>
        <BackControl />
      </nav>

    <section>
      <h2>{artwork.title}</h2>

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

      <a
        href={artwork.objectURL ? artwork.objectURL : "Unknown"}
        title="See this artwork in the www.MetMuseum.org"
      >
        <strong>URL:</strong>
        {artwork.objectURL ? artwork.objectURL : "Unknown"}
      </a>
      </section>
      
      <ShareArtwork title={artwork.title} url={artwork.objectURL} />

      <Footer/>
    </>
  );
};

export default MetCard;
