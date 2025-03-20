import { useState } from "react";
import { updateCollection, deleteCollection } from "../utils/api";

import { useNavigate } from "react-router-dom";

const CollectionCard = ({
  collection,
  setListCollections,
  listCollections,
}) => {
  console.log(collection);
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
        setListCollections(
          listCollections.filter(
            (col) => col.id_collection !== collection.id_collection
          )
        );
      })
      .catch((err) => console.error("Error deleting collection:", err));
  };

  const handleOpenCollection = () => {
    console.log(collection.id_collection);
    navigate(
      `/home/collection/${collection.id_collection}-${collection.title}`
    );
  };

  return (
    <li className="collection-card">
      {editing ? (
        <>
          <label>
            Edit title
            <input
              className="collection-input"
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </label>
          <button className="btn-back" onClick={handleUpdate}>
            Save
          </button>
          <button className="btn-back" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <div className="button-group">
          <span className="collection-title">{collection.title}</span>
          <button className="btn-edit" onClick={() => setEditing(true)}>
            Edit Name
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete Collection
          </button>
          <button className="btn-open" onClick={handleOpenCollection}>
            {collection.art_count < 1
              ? "Add to Collection"
              : `Manage ${collection.art_count} artwork${collection.art_count > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </li>
  );
};

export default CollectionCard;
