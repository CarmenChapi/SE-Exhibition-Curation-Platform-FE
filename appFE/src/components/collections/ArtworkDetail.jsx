import { useEffect, useState } from "react";
import { getArtworkByIdArtwork, updateArtwork } from "../../utils/api";
import { useParams } from "react-router-dom";
import Header from "../Header";
import ErrorPage from "../ErrorPage";
import UserProfile from "../UserProfile";
import MenuCollections from "../MenuCollections";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import "./Collections.css";
import { IoCaretBack } from "react-icons/io5";

const ArtworkDetail = () => {
  const { collectionId, nameCollection,artworkId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [artwork, setArtwork] = useState([]);
  const [error, setError] = useState(null);
  const [updatedArtwork, setUpdatedArtwork] = useState({});
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworkById = () => {
      setIsLoading(true);
      getArtworkByIdArtwork(artworkId)
        .then((artwork) => {
          console.log("artwork:", artworkId, artwork);
          setArtwork(artwork);
          setUpdatedArtwork(artwork);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("err", err);
          if (err.response?.status === 404) {
            setArtwork([]);
            setError(null);
          } else {
            setError(err);
          }
          setIsLoading(false);
        });
    };

    if (artworkId) {
      fetchArtworkById();
    }
  }, [artworkId]);

  const handleEdit = () => {
    setUpdatedArtwork({ ...artwork });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setUpdatedArtwork({ ...artwork });
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setUpdatedArtwork((currentArtwork) => ({
      ...currentArtwork,
      [field]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!updatedArtwork.title?.trim()) {
      return alert("Title cannot be empty!");
    }

    if (isSaving) return;

    setIsSaving(true);
    try {
      const updated = await updateArtwork(artwork.id_artwork, updatedArtwork);
      setArtwork(updated);
      setUpdatedArtwork(updated);
      setEditing(false);
    } catch (err) {
      console.error("Error updating artwork:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    console.log("Back");
      navigate(`/home/collections/${nameCollection}/${collectionId}`);
  }


   if (isLoading)
    return <Loading pageLoading="Loading artwork" />;
  if (error) return <ErrorPage errorMsg={`Error: ${error.message}`} />;

  return (
    <>
     
      <nav className="topMenu">
        <UserProfile />
        <MenuCollections />
      </nav>


             <div>
        <Link
          to={`/home/collections`}
          className="link-menu"
        >
          <h2>{nameCollection}</h2>
        </Link>
      </div>
  
      <section className="description-section featured-detail-section">
        {editing ? (
          <form className="artwork-form" onSubmit={handleUpdate}>
            <h2>Edit artwork</h2>
            <div className="form-row">
              <label>
                Edit title
                <input
                  type="text"
                  value={updatedArtwork.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Edit artist
                <input
                  type="text"
                  value={updatedArtwork.artist || ""}
                  onChange={(e) => handleInputChange("artist", e.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Edit location
                <input
                  type="text"
                  value={updatedArtwork.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Edit image url
                <input
                  type="text"
                  value={updatedArtwork.image_url || ""}
                  onChange={(e) =>
                    handleInputChange("image_url", e.target.value)
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Edit description
                <textarea
                  className="collection-input"
                  value={updatedArtwork.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </label>
            </div>
            <div className="button-group">
              <button aria-label="Save artwork changes" className="btn-back" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                aria-label="Cancel editing artwork"
                className="btn-back"
                type="button"
                disabled={isSaving}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>

            <h2>
              <strong>{artwork.title}</strong>
            </h2>
            {artwork.image_url ? (
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="detail-photo featured-detail-photo"
              />
            ) : (
              <p className="description-artwork">
                <MdOutlineImageNotSupported />
              </p>
            )}

            <p className="description-artwork">
              <strong>Title:</strong> {artwork.title ? artwork.title : "Unknown"}
            </p>

            <p className="description-artwork">
              <strong>Artist:</strong>{" "}
              {artwork.artist ? artwork.artist : "Unknown"}
            </p>

            <p className="description-artwork">
              <strong>Location:</strong>{" "}
              {artwork.location ? artwork.location : "Unknown"}
            </p>
            <p className="description-artwork">
              <strong>Description:</strong>{" "}
              {artwork.description ? artwork.description : "Unknown"}
            </p>
            <div>
            <button aria-label="Edit artwork" className="btn-back description-artwork" onClick={handleEdit}>
              Edit
            </button>
               <button aria-label="Back to artwork list" className="btn-back description-artwork" onClick={handleBack}>
              <IoCaretBack /> Back
            </button>
            </div>
          </>
        )}
      </section>
     
   
    </>
  );
}

export default ArtworkDetail;
