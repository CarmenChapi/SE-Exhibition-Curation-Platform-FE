import { useState } from "react";
import { updateArtwork, deleteArtwork } from "../utils/api";

const ArtworkCard = ({ artwork, setArtworks, artworks }) => {
  const [editing, setEditing] = useState(false);
  const [updatedArtwork, setUpdatedArtwork] = useState({ ...artwork });

  const handleUpdate = () => {
    if (!updatedArtwork.title.trim()) return alert("Title cannot be empty!");
    //console.log(artwork, updatedArtwork);

    updateArtwork(artwork.id_artwork, updatedArtwork)
      .then((updated) => {
        setArtworks(
          artworks.map((art) =>
            art.id_artwork === updated.id_artwork ? updated : art
          )
        );
        setEditing(false);
      })
      .catch((err) => console.error("Error updating artwork:", err));
  };

  const handleDelete = () => {
    deleteArtwork(artwork.id_artwork)
      .then(() => {
        setArtworks(
          artworks.filter((art) => art.id_artwork !== artwork.id_artwork)
        );
      })
      .catch((err) => console.error("Error deleting artwork:", err));
  };

  return (
    <li >
      {editing ? (
        <>
          <form className="artwork-form">
            <h2>Edit artwork</h2>
            <div className="form-row">
              <label>
                {" "}
                Edit title
                <input
                  type="text"
                  value={updatedArtwork.title}
                  onChange={(e) =>
                    setUpdatedArtwork({
                      ...updatedArtwork,
                      title: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                {" "}
                Edit artist
                <input
                  type="text"
                  value={updatedArtwork.artist}
                  onChange={(e) =>
                    setUpdatedArtwork({
                      ...updatedArtwork,
                      artist: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                {" "}
                Edit location
                <input
                  type="text"
                  value={updatedArtwork.location}
                  onChange={(e) =>
                    setUpdatedArtwork({
                      ...updatedArtwork,
                      location: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                {" "}
                Edit image url
                <input
                  type="text"
                  value={updatedArtwork.image_url}
                  onChange={(e) =>
                    setUpdatedArtwork({
                      ...updatedArtwork,
                      image_url: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                {" "}
                Edit description
                <textarea
                  className="collection-input"
                  value={updatedArtwork.description}
                  onChange={(e) =>
                    setUpdatedArtwork({
                      ...updatedArtwork,
                      description: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          </form>
          <button className="btn-back" onClick={handleUpdate}>
            Save
          </button>
          <button className="btn-back" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2>{artwork.title}</h2>

          {artwork.image_url ? (
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="detail-photo"
            />
          ) : (
            <p>No Image Added</p>
          )}

          <p>
            <strong>Description:</strong> {artwork.description}
          </p>
          <p>
            <strong>Artist:</strong> {artwork.artist}
          </p>
          <p>
            <strong>Location:</strong> {artwork.location}
          </p>
          <button className="btn-back" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="btn-back" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </li>
  );
};

export default ArtworkCard;
