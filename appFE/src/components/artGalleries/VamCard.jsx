
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ShareArtwork from "./ShareArt";
import TopButton from "../TopButton";
import ErrorPage from "../ErrorPage";
import MenuCollections from "../MenuCollections";
import Loading from "../Loading";

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

   if (isLoading)
    return <Loading pageLoading="Loading Victoria & Albert Museum..." />;
  if (isError) return <ErrorPage errorMsg={`Error: ${error.message}`}/>;
  if (isSuccess && !data) {
    return <ErrorPage errorMsg={`No artwork found for ID ${artId}`}/>;
  }

  const artwork = data;
  const imageId = artwork?.meta?.images?._images_meta?.[0]?.assetRef;
  const title = artwork.record?.titles?.[0]?.title || "Unknown";
  const artist = artwork.record?.artistMakerPerson?.[0]?.name?.text || "Unknown";
  const imageUrl = imageId
    ? `https://framemark.vam.ac.uk/collections/${imageId}/full/843,/0/default.jpg`
    : "";
  const artworkUrl = artwork.meta?._links?.collection_page?.href || "";
  const newArtwork = {
    title,
    location: "Victoria & Albert Museum",
    artist,
    image_url: imageUrl,
    description: artwork.record?.summaryDescription || "No description",
  };

  return (
    <>
    <nav className="topMenu">
      <MenuCollections />
    </nav>
    <div>
      <Link to="/home/artgallery/vam" className="link-menu">
        <h2>⬅ Victoria & Albert Museum</h2>
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
        <strong>Description:</strong>{" "}
        {artwork.record?.summaryDescription || "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Historical Context:</strong>{" "}
        {artwork.record?.historicalContext || "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Techniques:</strong>{" "}
        {artwork.record?.materialsAndTechniques || "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Date:</strong> {artwork.record?.productionDates?.[0]?.date?.text || "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>Credit Line:</strong> {artwork.record?.creditLine || "Unknown"}
      </p>
      <p className="description-artwork">
        <strong>URL:</strong>{" "}
      <a href={artworkUrl}
      title="See this artwork in the V&A website"
         target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >      Visit this artwork on V&A Museum</a>
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

export default VAMCard;
