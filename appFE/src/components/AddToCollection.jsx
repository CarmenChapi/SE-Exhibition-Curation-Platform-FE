import { useEffect, useState, useContext } from "react";
import { getArtworksByCollection, addArtwork } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import BackControl from "./BackControl";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddToCollection = ({}) => {
  const { collectionId, nameCollection } = useParams();
  const {} = useParams();
  const [error, setError] = useState(null);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    location: "",
    artist: "",
    description: "",
    image_url: "",
  });

  const { userCx } = useContext(UserContext);
    const navigate = useNavigate();


  const handleAddArtwork = (e) => {
    e.preventDefault();
    if (!newArtwork.title.trim()) return alert("Title cannot be empty!");

    // const artworkToAdd = { ...newArtwork, id_collection: collectionId };

    addArtwork(collectionId, newArtwork)
      .then((addedArtwork) => {
        setNewArtwork({
          title: "",
          location: "",
          artist: "",
          description: "",
          image_url: "",
        });
            navigate(
      `/home/collections/${nameCollection}/${collectionId}`,
    );
      })
      .catch((err) => setError(err));
  };

  if (error) return <ErrorPage errorMsg={`Error: ${error.message}`} />;
  return (
    <>
      <section className="collection-add-main">
      <Link to={`/home/collections/${nameCollection}/${collectionId}`} className="link-menu">
      <h2>{nameCollection}</h2>
  </Link>
   

      {/* 🔹 Add new artwork */}


        
        <h3>Add an artwork in your collection</h3>

        <form className="artwork-form">
          <div className="form-row">
            <label>
              Add a title
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

          <button type="button" className="btn-add" onClick={handleAddArtwork}>
            Add a new artwork
          </button>
        </form>
      </section>


    </>
  );
};

export default AddToCollection;
