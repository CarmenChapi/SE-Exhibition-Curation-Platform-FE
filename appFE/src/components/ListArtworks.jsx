import { useEffect, useState, useContext } from "react";
import { getArtworksByCollection, addArtwork } from "../utils/api";
import { UserContext } from "../context/UserContext";
import ArtworkCard from "./ArtworkCard";

const ListArtworks = ({ collectionId }) => {
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
      .then((artworksData) => {
        setArtworks(artworksData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  const handleAddArtwork = () => {
    if (!newArtwork.title.trim()) return alert("Title cannot be empty!");

    const artworkToAdd = { ...newArtwork, id_collection: collectionId };

    addArtwork(artworkToAdd)
      .then((addedArtwork) => {
        setArtworks([...artworks, addedArtwork]);
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
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div>
      <h2>Artworks in Collection</h2>

      {/* 🔹 Add new artwork */}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newArtwork.title}
          onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newArtwork.location}
          onChange={(e) => setNewArtwork({ ...newArtwork, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Artist"
          value={newArtwork.artist}
          onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newArtwork.image_url}
          onChange={(e) => setNewArtwork({ ...newArtwork, image_url: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newArtwork.description}
          onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
        />
        <button onClick={handleAddArtwork}>Add Artwork</button>
      </div>

      {/* 🔹 Artwork List */}
      {artworks.length === 0 ? (
        <p>No artworks found.</p>
      ) : (
        <ul>
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
