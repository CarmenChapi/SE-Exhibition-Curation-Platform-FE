import { useEffect, useState, useContext } from "react";
import { getArtworksByCollection, addArtwork } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import BackControl from "./BackControl";

const ListArtworks = ({  }) => {

  let { collectionId } = useParams();
  const nameCollection = collectionId.split("-")[1];
  collectionId = collectionId.split("-")[0];
  console.log(collectionId, nameCollection)

  //console.log(collectionId)
  const [isLoading, setIsLoading] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    location: "",
    artist: "",
    description: "",
    image_url: "",
  });

  const { userCx } = useContext(UserContext);

  useEffect(() => {
    if (collectionId) {
      fetchArtworks();
    }
  }, [collectionId]);

  const fetchArtworks = () => {
    setIsLoading(true);
    getArtworksByCollection(collectionId)
      .then((artworks) => {
        console.log("artworks", artworks)
        setArtworks(artworks);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err", err)
        setError(err);
        setIsLoading(false);
      });
  };

  const handleAddArtwork = () => {
    if (!newArtwork.title.trim()) return alert("Title cannot be empty!");

   // const artworkToAdd = { ...newArtwork, id_collection: collectionId };

    addArtwork(collectionId, newArtwork)
      .then((addedArtwork) => {
        setArtworks([addedArtwork, ...artworks ]);
        setNewArtwork({
          title: "",
          location: "",
          artist: "",
          description: "",
          image_url: "",
        });
      })
      .catch((err) => setError(err));
  };

  if (isLoading) return <h3 className="loading">...Loading</h3>;
  if (error && error.status !== 404) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div>
      <BackControl/>
      <h2>{userCx?.displayName.split(" ")[0]}'s {nameCollection} Collection:</h2>

      {/* 🔹 Add new artwork */}
      <div className="gallery-list ">
        <input
          type="text"
          className= "collection-input"
          placeholder="Title"
          value={newArtwork.title}
          onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
        />
        <input
          type="text"
          className= "collection-input"
          placeholder="Location"
          value={newArtwork.location}
          onChange={(e) => setNewArtwork({ ...newArtwork, location: e.target.value })}
        />
        <input
          type="text"
          className= "collection-input"
          placeholder="Artist"
          value={newArtwork.artist}
          onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
        />
        <input
          type="text"
          className= "collection-input"
          placeholder="Image URL"
          value={newArtwork.image_url}
          onChange={(e) => setNewArtwork({ ...newArtwork, image_url: e.target.value })}
        />
        <textarea
        className= "collection-input"
          placeholder="Description"
          value={newArtwork.description}
          onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
        />
        <button className= "btn-add" onClick={handleAddArtwork}>Add a new artwork</button>
      </div>

      {/* 🔹 Artwork List */}
      {artworks.length === 0 ? (
        <p>No artworks added.</p>
      ) : (
        <ul className="collection-list">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id_artwork}
              artwork={artwork}
              setArtworks={setArtworks}
              artworks={artworks}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListArtworks;
