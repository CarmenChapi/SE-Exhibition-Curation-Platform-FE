import { useState } from "react";
import { updateArtwork, deleteArtwork } from "../utils/api";

const ArtworkCard = ({ artwork, setArtworks, artworks }) => {
  const [editing, setEditing] = useState(false);
  const [updatedArtwork, setUpdatedArtwork] = useState({ ...artwork });

  const handleUpdate = () => {
    if (!updatedArtwork.title.trim()) return alert("Title cannot be empty!");
    console.log(artwork, updatedArtwork)

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
        setArtworks(artworks.filter((art) => art.id_artwork !== artwork.id_artwork));
      })
      .catch((err) => console.error("Error deleting artwork:", err));
  };

  return (
    <li class = "collection-card">
      {editing ? (
        <>
          <input
            class = "collection-input"
            type="text"
            value={updatedArtwork.title}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, title: e.target.value })}
          />
          <input
            type="text"
            class = "collection-input"
            value={updatedArtwork.location}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, location: e.target.value })}
          />
          <input
            type="text"
            class = "collection-input"
            value={updatedArtwork.artist}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, artist: e.target.value })}
          />
          <input
            type="text"
            class = "collection-input"
            value={updatedArtwork.image_url}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, image_url: e.target.value })}
          />
          <textarea
            class = "collection-input"
            value={updatedArtwork.description}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, description: e.target.value })}
          />
          <button class="btn-save" onClick={handleUpdate}>Save</button>
          <button class="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{artwork.title}</h3>
          {artwork.image_url && (
          <img src={artwork.image_url} alt={artwork.title} width="150" />)}
          <p>{artwork.description}</p>
          <p><strong>Artist:</strong> {artwork.artist}</p>
          <p><strong>Location:</strong> {artwork.location}</p>     
          <button class = "btn-edit" onClick={() => setEditing(true)}>Edit</button>
          <button class = "btn-delete" onClick={handleDelete}>Delete</button>
        </>
      )}
    </li>
  );
};

export default ArtworkCard;
