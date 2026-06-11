
import { addArtwork } from "../../utils/api";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import { TiPlusOutline } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Collections.css";

const AddToCollection = () => {
  const { collectionId, nameCollection } = useParams();
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    location: "",
    artist: "",
    description: "",
    image_url: "",
  });
  const navigate = useNavigate();

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!newArtwork.title.trim()) return alert("Title cannot be empty!");
    if (isAdding) return;

    setIsAdding(true);
    try {
      await addArtwork(collectionId, newArtwork);
      setNewArtwork({
        title: "",
        location: "",
        artist: "",
        description: "",
        image_url: "",
      });
      navigate(`/home/collections/${nameCollection}/${collectionId}`);
    } catch (err) {
      setError(err);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    navigate(`/home/collections/${nameCollection}/${collectionId}`);
  };

  if (error) return <ErrorPage errorMsg={`Error: ${error.message}`} />;
  return (
    <>
      <div>
        <Link
          to={`/home/collections/${nameCollection}/${collectionId}`}
          className="link-menu"
        >
          <h2>{nameCollection}</h2>
        </Link>
      </div>

      {/* 🔹 Add new artwork */}

      <h3>Add an artwork in this collection</h3>
      <section className="collection-add-main">
        <form className="artwork-form" onSubmit={handleAddArtwork}>
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
          <div className="main-menu">

          <button aria-label="Add artwork" type="submit" className="btn-add" disabled={isAdding}>
               <TiPlusOutline /> {isAdding ? "Adding..." : "Artwork"}
          </button>
            <button aria-label="Cancel adding artwork" type="button" className="btn-add" disabled={isAdding} onClick={handleCancel}>
            Cancel
          </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddToCollection;
