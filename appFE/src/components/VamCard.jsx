
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackControl from "./BackControl";
import ShareArtwork from "./ShareArt";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";

const fetchArtworkDetails = async (artworkId) => {
  const { data } = await axios.get(
    `https://api.vam.ac.uk/v2/museumobject/${artworkId}`
  );
  return data;
};

const VAMCard = () => {
  const { artId } = useParams(); 

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["artworkDetails", artId],
    queryFn: () => fetchArtworkDetails(artId),
  });

  if (isLoading) return <p>Loading V&A...</p>;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data;
  const id_image = artwork?.meta?.images?._images_meta?.[0]?.assetRef;
  //console.log(id_image);

  return (
    <>
    <h1 className="Header">Victoria & Albert Museum</h1>
    <nav>
      <BackControl/>
      </nav>

      <section>
      <h2 >
        {artwork.record.titles[0].title}
      </h2>
      <p >{artwork.record.artistMakerPerson[0] ?  artwork.record.artistMakerPerson[0].name.text : "Unknown" }</p>
      {id_image ? (
        <img
          src={`https://framemark.vam.ac.uk/collections/${id_image}/full/843,/0/default.jpg`}
          alt={artwork.record.titles[0].title}
           className="detail-photo"
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
      <a href={artwork.meta._links.collection_page.href ? artwork.meta._links.collection_page.href : ""}
      title="See this artwork in the V&A website"
         target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >      Visit this artwork on V&A Museum</a>
          </p>
  

      </section>
      <ShareArtwork title={artwork.record.titles[0].title} 
      url={artwork.meta._links.collection_page.href} />

      <Footer/>
    </>
  );
};

export default VAMCard;
