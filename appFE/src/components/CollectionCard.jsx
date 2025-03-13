import { useState } from "react";
import { updateCollection, deleteCollection } from "../utils/api";

import { useNavigate } from "react-router-dom";

const CollectionCard = ({ collection, setListCollections, listCollections }) => {
  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(collection.title);
  const navigate = useNavigate();

  const handleUpdate = () => {
    if (!updatedTitle.trim()) return alert("Title cannot be empty!");

    updateCollection(collection.id_collection, { title: updatedTitle })
      .then((updatedCollection) => {
        setListCollections(
          listCollections.map((col) =>
            col.id_collection === updatedCollection.id ? updatedCollection : col
          )
        );
        setEditing(false);
      })
      .catch((err) => console.error("Error updating collection:", err));
  };

  const handleDelete = () => {
    deleteCollection(collection.id_collection)
      .then(() => {
        setListCollections(listCollections.filter((col) => col.id_collection !== collection.id_collection));
      })
      .catch((err) => console.error("Error deleting collection:", err));
  };

  const handleOpenCollection = () => {
    navigate(`/home/collection/${collection.id_collection }`);
  }

  return (
    <li>
      {editing ? (
        <>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          {collection.title}
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleOpenCollection}>Open Collection</button>
        </>
      )}
    </li>
  );
};

export default CollectionCard;
