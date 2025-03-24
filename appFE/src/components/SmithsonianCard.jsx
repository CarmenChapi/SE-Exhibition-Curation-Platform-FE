import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import ShareArtwork from "./ShareArt";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";

const apiKeySmith = import.meta.env.VITE_API_KEY_SMITHSONIAN;

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.si.edu/openaccess/api/v1.0/content/${artworkId}?api_key=${apiKeySmith}`
  );
  return data;
};

const SmithsonianCard = () => {
  const { artId } = useParams();

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });


  if (isLoading) return <p>Loading Smithsonian...</p>;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data?.response) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data.response;
  //console.log(data.response, artwork.content.descriptiveNonRepeating.online_media.media[0].content);

  return (
    <>
    <h1 className="Header">Smithsonian Institution</h1>
    <nav>
  <BackControl/>
  </nav>
  <section>
      <h2>{artwork.title ? artwork.title : "Untitle"}</h2>
      <p>
        {artwork.content.freetext.name ? artwork.content.freetext.name[0].content : "Unknown"}
      </p>
      { 
  artwork.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.content && (
    <img
      src={artwork.content.descriptiveNonRepeating.online_media.media[0].content}
      alt={artwork.title || "Artwork Image"}
      className="detail-photo"
    />
  )
}

{ !artwork.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.content && (
    <p>No Image Available</p>
)}

      <p>
        <strong>Description:</strong>
        {artwork.content.freetext?.notes?.[1]?.content ? artwork.content.freetext.notes[1].content : "Unknown"}
      </p>
      <p>
        <strong>Type:</strong>
        {artwork.content.indexedStructured.object_type ? artwork.content.indexedStructured.object_type[0] : "Unknown"}
      </p>
      <p>
        <strong>Topic:</strong>
        {artwork.content.freetext.setName ? artwork.content.freetext.setName[1].content  : "Unknown"}
      </p>
      <p>
        <strong>Date:</strong>
        {artwork.content.indexedStructured.date
          ? artwork.content.indexedStructured.date
          : "Unknown"}
      </p>

      <p>
          <strong>URL:</strong>{" "}
          <a
      href={artwork.content.descriptiveNonRepeating.record_link || "" }
      title="See the item in the oficial website"
        target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >      Visit this artwork on Smithsonian</a>
        </p>
      </section>
     
      <ShareArtwork title={artwork.title} 
      url={artwork.content.descriptiveNonRepeating.record_link} />

      <Footer/>
    </>
  );
};

export default SmithsonianCard;
