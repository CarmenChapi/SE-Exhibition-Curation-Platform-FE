import React, { useState } from "react";

const ArtCollection = () => {
  // State to store art collection
  const [artworks, setArtworks] = useState([]);

  // State for new artwork inputs
  const [newArtwork, setNewArtwork] = useState({ title: "", artist: "" });

  // State to track the artwork being edited
  const [editArtwork, setEditArtwork] = useState(null);

  /** 📌 CREATE: Add new artwork */
  const addArtwork = () => {
    if (newArtwork.title && newArtwork.artist) {
      setArtworks([...artworks, { id: Date.now(), ...newArtwork }]);
      setNewArtwork({ title: "", artist: "" }); // Reset input fields
    }
  };

  /** 📌 UPDATE: Edit artwork details */
  const updateArtwork = () => {
    setArtworks(
      artworks.map((art) =>
        art.id === editArtwork.id ? editArtwork : art
      )
    );
    setEditArtwork(null); // Exit edit mode
  };

  /** 📌 DELETE: Remove an artwork from the collection */
  const deleteArtwork = (id) => {
    setArtworks(artworks.filter((art) => art.id !== id));
  };

  return (
    <div>
      <h2>🎨 Art Collection</h2>

      {/* 📌 CREATE: Add New Artwork Collection */}
      <div>
        <input
          type="text"
          placeholder="Collection Title"
          value={newArtwork.title}
          onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
        />
      </div>

      {/* 📌 UPDATE: Edit Artwork */}
      {editArtwork && (
        <div>
          <h3>Edit Artwork</h3>
          <input
            type="text"
            value={editArtwork.title}
            onChange={(e) => setEditArtwork({ ...editArtwork, title: e.target.value })}
          />
          <button onClick={updateArtwork}>Save</button>
        </div>
      )}

      {/* 📌 READ: Display Art Collection */}
      <ul>
        {artworks.map((art) => (
          <li key={art.id}>
            <strong>{art.title}</strong> by {art.artist}
            <button onClick={() => setEditArtwork(art)}>Edit</button>
            <button onClick={() => deleteArtwork(art.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtCollection;
