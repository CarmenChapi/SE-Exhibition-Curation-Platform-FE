import { useEffect, useState, useContext } from "react";
import { getArtworksByCollection, addArtwork } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import BackControl from "./BackControl";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";

const ListArtworks = ({}) => {
  const  { collectionId, nameCollection } = useParams();
  const {}  = useParams();

 // console.log(collectionId, nameCollection);
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
        console.log("artworks", artworks);
        setArtworks(artworks);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        if (err.response?.status === 404) {
          setArtworks([]);
          setError(null);
        } else {
          setError(err);

        }
        setIsLoading(false);
      });
  };

  const handleAddArtwork = () => {
    if (!newArtwork.title.trim()) return alert("Title cannot be empty!");

    // const artworkToAdd = { ...newArtwork, id_collection: collectionId };

    addArtwork(collectionId, newArtwork)
      .then((addedArtwork) => {
        setArtworks([addedArtwork, ...artworks]);
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

  if (isLoading) return <h3 className="loading">Loading User Art...</h3>;
  if (error)
    return <ErrorPage errorMsg={`Error: ${error.message}`}/>;


  return (
    <>
      
      <h1 className="Header">
        {userCx?.displayName?.split(" ")[0] ? userCx?.displayName?.split(" ")[0] : "User"}'s Collection:
      </h1>
      <h2>{nameCollection}</h2>
      <nav>
      <BackControl />
      </nav>

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
      {/* 🔹 Add new artwork */}

      <section className="gallery-list">
      <h3>Add an artwork in your collection</h3>

      <form className="artwork-form">
      <div className="form-row">
        <label>
          Add a name
          <input
            type="text"
            placeholder="Title"
            value={newArtwork.title}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, title: e.target.value })
            }
          />
        </label>
        </div>
        <div className="form-row">
        <label>
          Add a location
          <input
            type="text"
            placeholder="Location"
            value={newArtwork.location}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, location: e.target.value })
            }
          />
        </label>
        </div>
        <div className="form-row">
        <label>
          Add a author name
          <input
            type="text"
            placeholder="Artist"
            value={newArtwork.artist}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, artist: e.target.value })
            }
          />
        </label>
        </div>
        <div className="form-row">
        <label>
          Add a valid URL
          <input
            type="text"
            placeholder="Image URL"
            value={newArtwork.image_url}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, image_url: e.target.value })
            }
          />
        </label>
        </div>
        <div className="form-row">
        <label>
          Add a description
          <textarea
            placeholder="Description"
            value={newArtwork.description}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, description: e.target.value })
            }
          />
        </label>
        </div>

        <button className="btn-add" onClick={handleAddArtwork}>
          Add a new artwork
        </button>
        </form>
      </section>


      <Footer/>
    </>
  );
};

export default ListArtworks;
